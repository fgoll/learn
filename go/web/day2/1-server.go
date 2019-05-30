package main

import (
	"fmt"
	"net/http"
)

// #2.一个处理器就是一个拥有ServeHTTP方法的接口
// 为什么#1的默认值DefaultServeMux, 因为DefaultServeMux多路复用器是ServeMux结构的一个实例,
// 而后者也拥有ServeHTTP方法
type MyHandler struct {}

func (h *MyHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Hello World!")
}

func main() {
	handler := MyHandler{}
	server := http.Server{
		Addr: "127.0.0.1:8088",
		Handler: &handler, 	// #1.如果处理器参数为nil, 那么服务器将使用默认的多路复用器DefaultServeMux
	}

	server.ListenAndServe()
}