package main

import (
	"database/sql"
)

var Db *sql.DB

type Text interface {
	fetch(id int) (err error)
	create() (err error)
	update() (err error)
	delete() (err error)
}

type Post struct {
	Db      *sql.DB
	Id      int    `json:"id"`
	Content string `json:"content"`
	Author  string `json:"author"`
}

func (post *Post) fetch(id int) (err error) {

	err = post.Db.QueryRow("select id, content, author from posts where id = $1",
		id).Scan(&post.Id, &post.Content, &post.Author)
	return
}

// 创建帖子
func (post *Post) create() (err error) {
	statement := "insert into posts (content, author) values ($1, $2) returning id"
	stmt, err := post.Db.Prepare(statement)
	if err != nil {
		return
	}
	defer stmt.Close()
	err = stmt.QueryRow(post.Content, post.Author).Scan(&post.Id)
	return
}

// 更新帖子
func (post *Post) update() (err error) {
	_, err = post.Db.Exec("update posts set content = $2, author = $3 where id = $1", post.Id, post.Content, post.Author)
	return
}

// 删除帖子
func (post *Post) delete() (err error) {
	_, err = post.Db.Exec("delete from posts where id = $1", post.Id)
	return
}
