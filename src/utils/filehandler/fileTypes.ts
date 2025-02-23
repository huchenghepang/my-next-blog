
interface FILE_TYPES_TYPE {
    image: string[];
    document: string[];
    video: string[];
    audio: string[];
    archive: string[];
    program: string[];
    notes: string[];
    default: never[];
}

const FILE_TYPES: FILE_TYPES_TYPE = {
    'image': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'],
    'document': ['.pdf', '.docx', '.doc', '.txt', '.xlsx', '.pptx'],
    'video': ['.mp4', '.mkv', '.avi', '.mov'],
    'audio': ['.mp3', '.wav', '.aac', '.flac'],
    'archive': ['.zip', '.rar', '.7z', '.tar', '.gz'],
    'program': ['.exe', '.msi', '.bat', '.sh'],
    'notes': ['.md'],
    'default': [], // 默认类型
};

export default FILE_TYPES;
