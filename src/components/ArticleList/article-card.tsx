// components/ArticleCard.tsx
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface ArticleCardProps {
  id: string | number;
  title: string;
  excerpt: string;
  coverImage?: string;
  date: string;
  author: {
    name: string;
    avatar?: string;
  };
  tags?: string[];
  category?: string;
}

export default function ArticleCard({
  id,
  title,
  excerpt,
  coverImage,
  date,
  author,
  tags = [],
  category,
}: ArticleCardProps) {
  return (
    <Card
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
    >
      {/* 封面图 */}
      {coverImage && (
        <CardMedia
          component="img"
          height="200"
          image={coverImage}
          alt={title}
          style={{
            objectFit: "cover",
            transition: "transform 0.3s",
          }}
        />
      )}

      <CardContent style={{ flexGrow: 1 }}>
        {/* 分类标签 */}
        {category && (
          <Typography
            gutterBottom
            style={{
              color: "#1976d2",
              fontSize: 14,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {category}
          </Typography>
        )}

        {/* 标题 */}
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          style={{
            fontWeight: "bold",
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>

        {/* 标签组 */}
        {tags.length > 0 && (
          <Stack
            direction="row"
            spacing={1}
            style={{ marginBottom: 16, flexWrap: "wrap", gap: 8 }}
          >
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                style={{
                  fontSize: "0.75rem",
                  backgroundColor: "rgba(25, 118, 210, 0.1)",
                }}
              />
            ))}
          </Stack>
        )}

        {/* 摘要 */}
        <Typography
          variant="body2"
          style={{
            color: "rgba(0, 0, 0, 0.6)",
            marginBottom: 16,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {excerpt}
        </Typography>

        {/* 作者信息 */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar
            src={author.avatar}
            alt={author.name}
            style={{ width: 32, height: 32 }}
          >
            {!author.avatar && author.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" style={{ fontWeight: "medium" }}>
              {author.name}
            </Typography>
            <Typography
              variant="caption"
              style={{ color: "rgba(0, 0, 0, 0.6)" }}
            >
              {new Date(date).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          </Box>
        </Stack>
      </CardContent>

      <CardActions style={{ padding: "16px 16px 16px 16px" }}>
        <Button size="small" href={`/articles/${id}`}>
          阅读更多 →
        </Button>
      </CardActions>
    </Card>
  );
}
