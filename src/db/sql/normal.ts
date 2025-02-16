import { Tables } from './../../types/mysql.d';

import { createError } from "@/app/utils/createError";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../mysql";

/**
 * 通用新增函数，用于向指定表中插入数据
 *
 * @template T 数据对象的类型，键名为字段名，键值为对应的插入值
 * @template N 表名的类型，默认为 `Tables` 类型
 *
 * @param {N} tableName 表名，目标插入的表
 * @param {T} data 插入的数据对象，键名为表字段名，键值为对应的插入值
 * @returns {Promise<ResultSetHeader>} 插入结果，包含受影响的行数和生成的自增 ID 等信息
 *
 * @example
 * // 示例1：向 user_info 表中插入用户记录
 * const result = await insertRecord("user_info", {
 *   username: "JohnDoe",
 *   email: "john.doe@example.com",
 *   status: 1,
 *   created_at: new Date()
 * });
 * console.log(result.insertId); // 打印插入记录的 ID
 *
 * @example
 * // 示例2：动态表名和数据插入
 * const tableName = "articles";
 * const data = {
 *   title: "如何使用 TypeScript 编写通用函数",
 *   content: "本文详细介绍了通用新增函数的实现。",
 *   author_id: 1,
 *   published_at: new Date()
 * };
 * const result = await insertRecord(tableName, data);
 * console.log(result.affectedRows); // 打印受影响的行数
 */
export const insertRecord = async <T extends Record<string, any>, N extends string = Tables>(
    tableName: N,
    data: T
) => {

    // 获取字段名和占位符
    const fields = Object.keys(data);
    const placeholders = fields.map(() => "?").join(", ");
    const values = Object.values(data);

    // 动态生成 SQL 语句
    const sql = `INSERT INTO \`${tableName}\` (${fields.map(f => `\`${f}\``).join(", ")}) VALUES (${placeholders})`;

    // 使用 mysql2 执行 SQL 查询
    return await pool.query<ResultSetHeader>(sql, values);
};


/* 批量插入数据 */
export const insertRecordBatch = async <
    T extends Record<string, any>,
    N extends string = Tables,>(
    tableName: N,
        fields: (Extract<keyof T, string>)[],
    values: any[][]
) => {
    if (values.length === 0) {
        throw new Error("数据不能为空");
    }

    // 生成字段部分
    const fieldPlaceholders = fields.map(f => `\`${f}\``).join(", ");

    // 生成批量占位符
    const placeholders = values.map(() => `(${fields.map(() => "?").join(", ")})`).join(", ");

    // 展平所有数据值
    const flattenedValues = values.flat();

    // 生成 SQL 语句
    const sql = `INSERT INTO \`${tableName}\` (${fieldPlaceholders}) VALUES ${placeholders}`;

    // 执行 SQL 语句
    return await pool.query<ResultSetHeader>(sql, flattenedValues);
};



/**
 * 根据字段查询数据，支持分页功能
 *
 * @template Entity 实体对象类型，表示表中的数据结构
 * @template T 表名的类型
 * @template INFO 查询结果的数据类型
 * 
 * @param {T} tableName 表名，必须是数据库中已存在的表
 * @param {(keyof Entity)[]} fields 查询条件字段数组，例如 `['username', 'email']`
 * @param {any[]} values 查询条件的值，数组顺序需要与 `fields` 对应
 * @param {{ page: number, limit: number }=} pagination 分页信息，包含 `page` 和 `limit`，可选参数
 * @returns {Promise<{
 *   data: INFO[];
 *   pagination: { total: number; page: number; limit: number }
 * } | null>} 查询结果，包含数据数组和分页元数据。如果没有匹配的记录，返回 `null`
 * 
 * @example
 * // 示例1：查询用户名为 "JohnDoe" 的用户，分页第 1 页，每页 10 条
 * const result = await queryByFieldsWithPagination<UserInfo>(
 *   "user_info",
 *   ["username"],
 *   ["JohnDoe"],
 *   { page: 1, limit: 10 }
 * );
 * console.log(result?.data); // 打印查询到的用户数据
 *
 * @example
 * // 示例2：不分页查询 email 为 "example@mail.com" 的用户
 * const result = await queryByFieldsWithPagination<UserInfo>(
 *   "user_info",
 *   ["email"],
 *   ["example@mail.com"]
 * );
 * console.log(result?.data); // 打印查询到的用户数据
 */
export const queryByFieldsWithPagination = async <
    Entity extends Record<string, any>,
    T extends string = Tables,
    INFO = Entity
>(
    tableName: T,
    fields: (keyof Entity)[],
    values: any[],
    pagination?: {
        page: number,
        limit: number
    }
) => {
    const whereClause = fields.map((field, index) => `${String(field)} = ?`).join(' AND ');
    const sql = `SELECT * FROM ${tableName} ${whereClause ? "WHERE "+whereClause :""}`;


    // 分页查询
    const limitClause = pagination?.page && pagination.limit ? ` LIMIT ${(pagination.page - 1) * pagination.limit}, ${pagination.limit}` : '';
    const paginatedSql = `${sql}${limitClause}`;

    /* 执行分页查询 */
    const [rows] = await pool.query<RowDataPacket[]>(paginatedSql, values);

    let total: number;
    if (pagination) {
        /* 如果需要分页就单独查询总页数 */
        const totalSql = `SELECT COUNT(*) as total FROM ${tableName} WHERE ${whereClause}`;
        const [totalResult] = await pool.query<RowDataPacket[]>(totalSql, values);
        total = totalResult[0]?.total ?? 0;
    } else {
        total = rows.length
    }
    // 查询总记录数


    if (rows.length > 0) {
        return {
            data: rows as INFO[],
            pagination: {
                total: total,
                page: pagination?.page ?? 1,
                limit: rows.length,
            }
        };
    } else {
        return null;
    }
};


/**
 * 根据字段查询数据，支持分页功能和返回指定字段
 *
 * @template Entity 实体对象类型，表示表中的数据结构
 * @template T 表名的类型
 * @template SelectedFields 返回的字段类型
 * 
 * @param {T} tableName 表名，必须是数据库中已存在的表
 * @param {(keyof Entity)[]} fields 查询条件字段数组，例如 `['username', 'email']`
 * @param {any[]} values 查询条件的值，数组顺序需要与 `fields` 对应
 * @param {SelectedFields[]} selectFields 要返回的字段数组，例如 `['username', 'email']`
 * @param {{ page: number, limit: number }=} pagination 分页信息，包含 `page` 和 `limit`，可选参数
 * @returns {Promise<{
 *   data: Pick<Entity, SelectedFields[number]>[];
 *   pagination: { total: number; page: number; limit: number }
 * } | null>} 查询结果，包含数据数组和分页元数据。如果没有匹配的记录，返回 `null`
 * 
 * @example
 * // 示例：查询用户名为 "JohnDoe" 的用户，返回 `username` 和 `email` 字段
 * const result = await queryByFieldsWithSelectedFields<UserInfo>(
 *   "user_info",
 *   ["username"],
 *   ["JohnDoe"],
 *   ["username", "email"],
 *   { page: 1, limit: 10 }
 * );
 * console.log(result?.data); // [{ username: "JohnDoe", email: "john@example.com" }]
 */
export const queryByFieldsWithSelectedFields = async <
    Entity extends Record<string, any>,
    T extends string = Tables,
    SelectedFields extends (keyof Entity)[] = (keyof Entity)[]
>(
    tableName: T,
    fields: (keyof Entity)[],
    values: any[],
    selectFields: SelectedFields,
    pagination?: {
        page: number;
        limit: number;
    }
): Promise<{
    data: { [K in SelectedFields[number]]: Entity[K] }[];
    pagination: { total: number; page: number; limit: number };
} | null> => {
    // 构建 WHERE 子句
    const whereClause = fields.map((field, index) => `${String(field)} = ?`).join(' AND ');

    // 构建 SELECT 子句，使用指定的字段
    const selectedColumns = selectFields.map(field => String(field)).join(', ');
    const sql = `SELECT ${selectedColumns} FROM ${tableName} ${whereClause ? "WHERE " + whereClause :""}`;

    // 构建分页子句
    const limitClause = pagination?.page && pagination.limit
        ? ` LIMIT ${(pagination.page - 1) * pagination.limit}, ${pagination.limit}`
        : '';
    const paginatedSql = `${sql}${limitClause}`;

    
    // 执行分页查询
    const [rows] = await pool.query<RowDataPacket[]>(paginatedSql, values);

    let total: number;
    if (pagination) {
        // 查询总记录数
        const totalSql = `SELECT COUNT(*) as total FROM ${tableName} ${whereClause ?"WHERE "+whereClause:""}`;

        console.log(totalSql);
        
        const [totalResult] = await pool.query<RowDataPacket[]>(totalSql, values);
        total = totalResult[0]?.total ?? 0;
    } else {
        total = rows.length;
    }

    // 返回查询结果
    if (rows.length >= 0) {
        return {
            data: rows as Pick<Entity, SelectedFields[number]>[],
            pagination: {
                total: total,
                page: pagination?.page ?? 1,
                limit: pagination?.limit ?? rows.length,
            },
        };
    } else {
        return null;
    }
};
type JoinType = "INNER JOIN" | "LEFT JOIN" | "RIGHT JOIN" | "FULL JOIN";

export interface QueryOptions<Entity extends Record<string, any>, NextEntity extends Record<string, any> = QueryOptions<Record<string, any>, Record<string, any>>, T extends string = Tables, SelectedFields = (keyof Entity | { selectField: keyof Entity, alias: string })[]> {
    /* 表名 */
    tableName: T;
    /* 别名 */
    aliasTableName?: string;
    /* 上一个连接的类型 */
    joinType?: JoinType | null;
    /* 上一个连接类型对应的字段 */
    lastField: keyof Entity;
    /* 下一个连接类型对应的字段 */
    nextField?: keyof Entity;
    /* 下一个连接表的信息 */
    next?: NextEntity;
    /* 条件字段 */
    fields?: (keyof Entity)[] ,
    /* 条件字段匹配的值 */
    values?: any[],
    /* 选择该表需要返回的字段,特殊情况下要用别名对象形式 否则应该是字符串，别名会破坏类型推导  */
    selectFields?: SelectedFields,
}

/**
 * 执行带连接的查询函数
 * 
 * @template Entity 实体类型，必须是一个对象
 * @template X 查询选项类型，默认为 `QueryOptions<Record<string, any>, Record<string, any>>`
 * @template T 表名类型，默认为 `Tables`
 * @template SelectedFields 选择字段类型，默认为 `(keyof Entity | { selectField: keyof Entity, alias: string })[]`
 * 
 * @param {T} baseTableName 基础表名
 * @param {keyof Entity} connectField 连接字段
 * @param {X} joinInfo 连接信息
 * @param {(keyof Entity)[]} [fields] 查询条件字段
 * @param {any[]} [values] 查询条件值
 * @param {SelectedFields} [selectFields] 选择的字段
 * 
 * @returns {object | null} 返回生成的查询语句和对应的值，如果出错则返回 null
 * 
 * @throws {Error} 如果条件字段和条件值不匹配，则抛出验证错误
 */
export function queryWithJoin<
    Entity extends Record<string, any>,
    X = QueryOptions<Record<string, any>, Record<string, any>>,
    T extends string = Tables,
    SelectedFields extends (keyof Entity | { selectField: keyof Entity, alias: string })[] = (keyof Entity | { selectField: keyof Entity, alias: string })[],
>(
    baseTableName: T,
    connectField: keyof Entity,
    joinInfo: X,
    fields?: (keyof Entity)[],
    values?: any[],
    selectFields?: SelectedFields,
    groupBy=''
) {
    try {
        /* 如果条件字段不一致报错 */
        if (fields?.length !== values?.length) {
            throw createError("ValidationError", "条件字段需要相符")
        }
        // 选择的字段：加上表名（或别名）
        let selectedSql: string[] = []; // 默认查询所有字段
        if (selectFields?.length) {
            selectedSql = selectFields.map(field => {
                let needField: string;
                if(typeof field == "object") {
                    needField = String(field.selectField) + 'as ' + field.alias
                }else{
                    needField = String(field)
                }
                // 假设如果表别名存在，则使用别名，否则直接使用表名
                const tableAlias = baseTableName;
                return `${tableAlias}.${String(needField)}`;
            });
        }

        // 拼接连接条件
        let connectASql = `${baseTableName}`;
        let currentJoin = joinInfo;
        /* 当前下一个查询类型的连接字段 */
        let currentOhtherField = String(connectField);
        const whereSql: string[] = [];
        if (fields?.length) {
            fields.forEach(field => {
                // 假设如果表别名存在，则使用别名，否则直接使用表名
                const tableAlias = baseTableName;
                whereSql.push(`${tableAlias}.${String(field)}`);
            })
        }
        let valuesArr: any[] = values || [];
        let currentTabelName = baseTableName
        while (currentJoin) {
            // @ts-expect-error 导入问题
            const { tableName: tableName, joinType: currentJoinType, lastField, nextField, next, aliasTableName, selectFields, fields, values } = currentJoin;
            if (currentJoinType && tableName && lastField) {
                connectASql += ` ${currentJoinType} ${tableName} ${aliasTableName ? " as " + aliasTableName + " " : ""} ON ${currentTabelName}.${String(currentOhtherField)} = ${aliasTableName ? aliasTableName : tableName}.${lastField}`;
                currentTabelName = aliasTableName ? aliasTableName : tableName;
                currentOhtherField = nextField ? nextField : lastField;
                /* 查询字段是否在 */
                if (selectFields?.length) {
                    selectedSql = [...selectedSql, ...selectFields.map((field:any) => {
                        let needField: string = field
                        if (typeof field !== "string") {
                            needField = field.selectField + ' as ' + field.alias
                        }
                        return `${currentTabelName}.${String(needField)}`;
                    })];
                }
                // 条件字段需要相符否则报错
                if (fields && values) {
                    if (fields.length === values.length) {
                        fields.forEach((field: any) => {
                            // 假设如果表别名存在，则使用别名，否则直接使用表名
                            const tableAlias = aliasTableName || tableName;
                            whereSql.push(`${tableAlias}.${String(field)}`);
                        })
                        valuesArr = [...valuesArr, ...values]
                    } else {
                        throw createError("ValidationError", "条件字段需要相符")
                    }
                }
            }

            // 递归拼接下一个连接 
            currentJoin = next || undefined;
        }
        const whereSqlFinal = whereSql.length ? "WHERE " + whereSql.join(" = ? AND ") + " = ?" : "";
        const sql = `SELECT ${selectedSql.join(",")} FROM ${connectASql}  ${whereSqlFinal} ${ groupBy}`
        // 打印或返回生成的查询
        return { sql, values: valuesArr }
    } catch (error) {
        return null
    }
}








/* 柯里化查询函数 */
/**
 * 生成一个函数，用于通过指定字段查询表，并可选分页。
 *
 * @template T - 表名的类型，默认为 `Tables`。
 * @template Entity - 要查询的实体类型。
 * @template INFO - 返回的信息类型，默认为 `Entity`。
 *
 * @param {T} tableName - 要查询的表名。
 * @returns {Function} - 一个函数，该函数接受字段、值和可选的分页参数来执行查询。
 *
 * @function
 * @param {Array<keyof Entity>} fields - 要查询的字段。
 */
/**
 * 根据字段进行分页查询的通用函数。
 * 
 * @template T 表名的类型，默认为 `Tables`。
 * @template Entity 实体类型，默认为 `Record<string, any>`。
 * @template INFO 返回信息的类型，默认为 `Entity`。
 * 
 * @param {T} tableName 表名。
 * @returns {Function} 返回一个函数，该函数接受字段、值和分页信息，并返回查询结果。
 * 
 * @example
 * ```typescript
 * const queryUsers = queryByFieldsWithPaginationCarried('users');
 * const result = await queryUsers(
 *     ['name', 'age'],
 *     ['John', 30],
 *     { page: 1, limit: 10 }
 * );
 * 
 * if (result) {
 *     console.log(result.data); // 查询到的数据
 *     console.log(result.pagination); // 分页信息
 * } else {
 *     console.log('No data found');
 * }
 * ```
 */
export const queryByFieldsWithPaginationCarried =
    <T extends string = Tables>(tableName: T) =>
        async <Entity extends Record<string, any>, INFO = Entity>(
            fields: (keyof Entity)[],
            values: any[],
            pagination?: {
                page: number,
                limit: number
            }
        ) => {
            const whereClause = fields.map((field, index) => `${String(field)} = ?`).join(' AND ');
            const sql = `SELECT * FROM ${tableName} WHERE ${whereClause}`;

            // 分页查询
            const limitClause = pagination?.page && pagination.limit ? ` LIMIT ${(pagination.page - 1) * pagination.limit}, ${pagination.limit}` : '';
            const paginatedSql = `${sql}${limitClause}`;

            /* 执行分页查询 */
            const [rows] = await pool.query<RowDataPacket[]>(paginatedSql, values);

            let total: number;
            if (pagination) {
                /* 如果需要分页就单独查询总页数 */
                const totalSql = `SELECT COUNT(*) as total FROM ${tableName} WHERE ${whereClause}`;
                const [totalResult] = await pool.query<RowDataPacket[]>(totalSql, values);
                total = totalResult[0]?.total ?? 0;
            } else {
                total = rows.length;
            }

            if (rows.length > 0) {
                return {
                    data: rows as INFO[],
                    pagination: {
                        total: total,
                        page: pagination?.page ?? 1,
                        limit: rows.length,
                    }
                };
            } else {
                return null;
            }
        };




/* 更新表格 */

/**
 * 通用数组参数形式的更新函数
 *
 * @template Entity 实体类型，对应表的字段类型
 * @template TableName 表名类型
 * @template T 更新字段数组类型
 * @template U 条件字段数组类型
 *
 * @param {TableName} tableName 表名
 * @param {T} needUpdateFields 需要更新的字段数组
 * @param {U} conditionalFields 条件字段数组，用于生成 WHERE 子句
 * @param {any[]} data 数据数组，包含更新字段值和条件字段值，长度必须等于 `needUpdateFields` 和 `conditionalFields` 的总和
 * @returns {Promise<ResultSetHeader>} 更新结果，包含受影响的行数
 *
 * @example
 * // 示例：更新 user_info 表中 id 为 1 的用户的用户名和状态
 * const result = await updateTable<UserInfo, "user_info">(
 *   "user_info",
 *   ["username", "status"], // 需要更新的字段
 *   ["id"], // 条件字段
 *   ["JohnDoeUpdated", 1, 1] // 数据数组 [更新值1, 更新值2, 条件值1]
 * );
 * console.log(result.affectedRows); // 输出受影响的行数
 */
export const updateTable = async <
    Entity extends Record<string, any>, // 实体类型
    TableName extends string, // 表名类型
    T extends (keyof Entity)[] = (keyof Entity)[],  // T 限制为 Entity 的键名数组
    U extends (keyof Entity)[] = (keyof Entity)[], // U 限制为 Entity 的键名数组
>(
    tableName: TableName,
    needUpdateFileds: T,
    conditionalFields: U,
    data: any[] // 如果 needUpdateFileds 是数组，data 应该是一个与 needUpdateFileds 长度一致的元组
) => {
    if ((needUpdateFileds.length + conditionalFields.length) !== data.length) {
      throw new Error("The sum of the update field array and the condition field array must be equal to the length of the data parameter array.")
    }
    // 构建 WHERE 条件
    const whereClause = conditionalFields
        .map((field) => `${String(field)} = ?`)
        .join(" AND ");
    // 构建 SET 字段
    const updateFieldsClause = needUpdateFileds
        .map((field) => `${String(field)} = ?`)
        .join(", ");
    // 构建 SQL 语句
    const sql = `UPDATE ${tableName} SET ${updateFieldsClause} WHERE ${whereClause}`;
    // 执行 SQL 并返回结果
    return pool.query<ResultSetHeader>(sql, data);
};


/* 创建数组形式的更新函数的工具函数 */
export const createUpdateTableInfo =  <Entity extends Record<string, any>, T extends | string = Tables>(
    tableName: T
) => <
    UpdateFields extends (keyof Entity)[],
    ConditionalFields extends (keyof Entity)[],
>(
    needUpdateFields: UpdateFields,
    conditionalFields: ConditionalFields,
    data: any[]
) => {
        return   updateTable<Entity, T, UpdateFields, ConditionalFields>(
            tableName,
            needUpdateFields,
            conditionalFields,
            data
        );
    };



/**
 * 更新数据库中的实体信息，基于指定的字段和条件。
 *
 * @template Entity - 实体类型。
 * @template TableName - 表名类型。
 * @template UpdateFields - 需要更新的字段类型。
 * @template ConditionalFields - 用作条件的字段类型。
 *
 * @param {TableName} tableName - 要更新的表名。
 * @param {UpdateFields} needUpdateFields - 需要更新的字段。
 * @param {ConditionalFields} conditionalFields - 用作更新条件的字段。
 * @param {Pick<Entity, UpdateFields[number]> & Partial<Pick<Entity, ConditionalFields[number]>>} data - 包含更新值和条件字段值的数据。
 *
 * @returns {Promise<ResultSetHeader>} - 一个解析为 SQL 查询结果的 Promise。
 */
export const updateEntityInfoByField = async <
    Entity extends Record<string, any>, // 实体类型
    TableName extends string, // 表名类型
    UpdateFields extends (keyof Entity)[], // 更新字段类型
    ConditionalFields extends (keyof Entity)[]// 条件字段类型
>(
    tableName: TableName, // 表名动态传入
    needUpdateFields: UpdateFields, // 更新字段
    conditionalFields: ConditionalFields, // 条件字段
    data: Pick<Entity, UpdateFields[number]> & Partial<Pick<Entity, ConditionalFields[number]>> // 数据字段类型
) => {

    // 构建 WHERE 条件
    const whereClause = conditionalFields
        .map((field) => `${String(field)} = ?`)
        .join(" AND ");

    // 构建 SET 字段
    const updateFieldsClause = needUpdateFields
        .map((field) => `${String(field)} = ?`)
        .join(", ");

    // 构建 SQL 语句
    const sql = `UPDATE ${tableName} SET ${updateFieldsClause} WHERE ${whereClause}`;

    // 提取参数值
    const values = [
         
        ...needUpdateFields.map((field) => data[field]),
         
        ...conditionalFields.map((field) => data[field]),
    ];

    // 执行 SQL 并返回结果
    return pool.query<ResultSetHeader>(sql, values);
};

// 工具函数：动态生成更新函数（对象形式）
/**
 * 创建一个用于更新实体信息的函数。
 *
 * @template Entity - 实体类型，必须是一个包含任意键值对的对象。
 * @template T - 表名类型，默认为字符串类型。
 * @template UpdateFields - 需要更新的字段数组类型。
 * @template ConditionalFields - 条件字段数组类型。
 *
 * @param tableName - 表名。
 * @returns 一个函数，该函数接受需要更新的字段、条件字段和数据，并调用 `updateEntityInfoByField` 函数进行更新操作。
 *
 * @param needUpdateFields - 需要更新的字段数组。
 * @param conditionalFields - 条件字段数组。
 * @param data - 包含需要更新字段和部分条件字段的数据对象。
 */
export const createUpdateEntityInfo = <Entity extends Record<string, any>, T extends | string = Tables>(
    tableName: T
) => <
    UpdateFields extends (keyof Entity)[],
    ConditionalFields extends (keyof Entity)[],
>(
    needUpdateFields: UpdateFields,
    conditionalFields: ConditionalFields,
    data: Pick<Entity, UpdateFields[number]> & Partial<Pick<Entity, ConditionalFields[number]>>
) => {
        return updateEntityInfoByField<Entity, T, UpdateFields, ConditionalFields>(
            tableName,
            needUpdateFields,
            conditionalFields,
            data
        );
    };


/* 删除记录 */
/**
 * 根据条件字段删除记录
 * 
 * @template Entity - 实体类型，必须是一个包含任意键值对的对象
 * @template T - 表名类型，必须是字符串
 * @template F - 条件字段数组类型，默认为实体的键数组
 * 
 * @param {T} tableName - 表名
 * @param {F} conditionFileds - 条件字段数组
 * @param {any[]} data - 条件字段对应的数据数组
 * 
 * @returns {Promise<ResultSetHeader>} - 返回一个包含删除结果的 Promise
 * 
 * @throws {Error} - 如果条件字段数组和数据数组长度不一致，则抛出错误
 */
export const deleteRecordByFileds = async <Entity extends Record<string, any>,
    T extends | string = Tables,
    F extends (keyof Entity)[] = (keyof Entity)[]>(tableName: T, conditionFileds: F,
        data: any[]
    ) => {
    if (data.length === conditionFileds.length) {
        new Error("Conditional judgment field arrays and data field arrays must be identical")
    }
    const conditionWhere = conditionFileds.map(filed => `${String(filed)} = ?`).join(" AND ");
    const sql = `DELETE FROM ${tableName} WHERE ${conditionWhere}`;
    return pool.query<ResultSetHeader>(sql, data)
}

/* 创建一个可以动态类型绑定的删除函数 */
/**
 * 创建一个删除记录的函数，通过指定的字段进行删除。
 * 
 * @template Entity - 实体类型，必须是一个包含任意键值对的对象。
 * @template T - 表名类型，默认为 `Tables` 类型。
 * 
 * @param tableName - 要操作的表名。
 * 
 * @returns 一个函数，该函数接受两个参数：
 *   - `conditionalFields` - 条件字段数组，这些字段将用于构建删除条件。
 *   - `data` - 包含条件字段对应值的对象。
 * 
 * @template ConditionalFields - 条件字段数组类型，必须是 `Entity` 的键数组。
 * @template F - 字段数组类型，默认为 `Entity` 的键数组。
 * 
 * @param conditionalFields - 用于构建删除条件的字段数组。
 * @param data - 包含条件字段对应值的对象。
 * 
 * @returns 调用 `deleteRecordByFileds` 函数，传入表名、条件字段和数据对象。
 */
export const createDeleteRecordByFileds = <Entity extends Record<string, any>, T extends | string = Tables>(
    tableName: T
) => <
    ConditionalFields extends (keyof Entity)[],
    F extends (keyof Entity)[] = (keyof Entity)[]
>(
    conditionalFields: ConditionalFields,
    data: { [K in keyof F]: F[K] extends keyof Entity ? Entity[F[K]] : never }
) => {
        return deleteRecordByFileds<Entity, T, ConditionalFields>(tableName, conditionalFields, data)
    }



/* 通用sql查询  */
/**
 * 执行数据库查询并返回结果。
 *
 * @template M - 查询结果的数据类型。
 * @param {string} sql - 要执行的 SQL 查询语句。
 * @param {any} values - 查询语句中的参数值。
 * @param {Object} [pagination] - 分页参数。
 * @param {number} pagination.page - 当前页码。
 * @param {number} pagination.limit - 每页显示的记录数。
 * @returns {Promise<{ data: M[], pagination: { total: number, page: number, limit: number } } | null>} - 返回查询结果和分页信息，如果没有结果则返回 null。
 */
export async function queryDB<M>(sql: string, values: any, pagination?: { page: number; limit: number }) {
    let total: number = 0;
    let paginationTotal: number = 0;
    if (pagination) {
        const paginationSql = `LIMIT ${pagination.limit} OFFSET ${(pagination.page - 1) * pagination.limit}`;
        const [totalResult] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS total_records FROM "+ sql.split("FROM")[1], values);       
        paginationTotal = totalResult[0].total_records || 0;
        sql += paginationSql;
    }   
    const [rows] = await pool.query<RowDataPacket[]>(sql, values);
    if (!pagination) total = rows.length;
    if (rows.length > 0) {
        return {
            data: rows as M[],
            pagination: {
                total: paginationTotal || total,
                page: pagination?.page ?? 1,
                limit: rows.length,
            }
        };
    } else {
        return null;
    }
}
