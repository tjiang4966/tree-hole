# Tree Hole 数据库模型

以下是 Tree Hole 应用的数据库模型图：

```mermaid
erDiagram
    USER ||--o{ ACORNBOX : creates
    USER ||--o{ REPLY : writes
    ACORNBOX ||--o{ REPLY : has

    USER {
        ObjectId _id "唯一标识符"
        string username "用户名，唯一"
        string email "电子邮箱，唯一"
        string password "加密存储的密码"
        date createdAt "账户创建时间"
        date lastLogin "最后登录时间"
        boolean isActive "账户是否活跃"
    }

    ACORNBOX {
        ObjectId _id "唯一标识符"
        string content "橡果盒内容"
        ObjectId author "作者的用户ID"
        string anonymousId "匿名标识符"
        string status "状态：可用/已打开/已删除"
        boolean allowReplies "是否允许回复"
        date createdAt "创建时间"
        ObjectId openedBy "打开者的用户ID"
        date openedAt "打开时间"
    }

    REPLY {
        ObjectId _id "唯一标识符"
        string content "回复内容"
        ObjectId acornBox "所属橡果盒ID"
        ObjectId author "回复者的用户ID"
        date createdAt "创建时间"
        boolean isRead "是否已读"
    }