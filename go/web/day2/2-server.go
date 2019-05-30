package main

/** 
 * 使用多个处理器
 */

import (
	"fmt"
	"net/http"
)

type HelloHandler struct{}

func (h *HelloHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Hello!")
}

type WorldHandler struct{}

func (h *WorldHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "World!")
}

func main() {
	hello := HelloHandler{}
	world := WorldHandler{}

	// #1.让服务器使用默认的DefaultServeMux作为处理器. 之后使用http.Handle函数将处理器绑定
	// 至DefaultServeMux
	server := http.Server{
		Addr:    "127.0.0.1:8088",
	}

	// #2.虽然Handle来源于http包, 但它实际上是ServeMux结构的方法, 这些函数是为了操作便利而创建的函数,
	// 调用http.Handle实际上就是在调用DefaultServeMux的Handle方法
	http.Handle("/hello", &hello)
	http.Handle("/world", &world)

	server.ListenAndServe()
}
