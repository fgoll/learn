package main

// 处理器函数

import (
	"fmt"
	"net/http"
)

// #1. 处理器函数实际上就是与处理器有相同行为的函数
func hello(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello")
}

func world(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "World")
}

func main() {
	server := http.Server{
		Addr: "127.0.0.1:8080",
	}

	// #2. 处理器函数实现原理: HanderFunc函数把一个带有正确签名的函数f转换成一个带有方法f的Handler
	http.HandleFunc("/hello", hello)
	// #3. 详解:
	// http.HandleFunc源码如下: 
	// 		func HandleFunc(pattern string, handler func(ResponseWriter, *Request)) {
	//			DefaultServeMux.HandleFunc(pattern, handler)
	//		}
	//
	// DefaultServeMux.HandleFunc源码如下:
	// 		func (mux *ServeMux) HandleFunc(pattern string, handler func(ResponseWriter, *Request)) {
	//			mux.Handle(pattern, HandlerFunc(handler))
	//		}
	//  上述代码将handler函数转换为HandlerFunc类型
	//
	// HandlerFunc定义如下:
	//		type HandlerFunc func(ResponseWriter, *Request)
	//		func (f HandlerFunc) ServeHTTP(w ResponseWriter, r *Request) {
	//			f(w, r)
	//		}
	// 可见HandlerFunc是一个func(ResponseWriter, *Request)的类型, 并且此类型实现了ServeHTTP方法
	// 因此他是一个满足Handler接口的类型, 故可以传递给mux.Handle()
	http.HandleFunc("/world", world)

	server.ListenAndServe()
}
