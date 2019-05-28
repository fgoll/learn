package main

import (
	"net/http"
)

func main() {
	// 创建多路复用器
	mux := http.NewServeMux()

	// 创建为静态文件服务的处理器
	files := http.FileServer(http.Dir("public"))
	// 移除URL中的指定前缀
	mux.Handle("/static/", http.StripPrefix("/static/", files))

	// 对根URL的请求重定向到名为index的处理器函数
	mux.HandleFunc("/", index)
	mux.HandleFunc("/err", err)
	
	mux.HandleFunc("/login", login)
	// mux.HandleFunc("/logout", logout)
	mux.HandleFunc("/signup", signup)
	mux.HandleFunc("/signup_account", signupAccount)
	mux.HandleFunc("/authenticate", authenticate)

	mux.HandleFunc("/thread/new", newThread)
	mux.HandleFunc("/thread/create", createThread)
	mux.HandleFunc("/thread/post", postThread)
	mux.HandleFunc("/thread/read", readThread)

	server := &http.Server {
		Addr: "0.0.0.0:8088",
		Handler: mux,
	}
	server.ListenAndServe()
}