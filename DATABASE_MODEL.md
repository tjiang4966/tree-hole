# Tree Hole 数据库模型

以下是 Tree Hole 应用的数据库模型图：

```mermaid
erDiagram
    USER ||--o{ ACORNBOX : creates
    USER ||--o{ REPLY : writes
    ACORNBOX ||--o{ REPLY : has

    USER {
        ObjectId _id
        string username
        string email
        string password
        date createdAt
        date lastLogin
        boolean isActive
    }

    ACORNBOX {
        ObjectId _id
        string content
        ObjectId author
        string anonymousId
        string status
        boolean allowReplies
        date createdAt
        ObjectId openedBy
        date openedAt
    }

    REPLY {
        ObjectId _id
        string content
        ObjectId acornBox
        ObjectId author
        date createdAt
        boolean isRead
    }