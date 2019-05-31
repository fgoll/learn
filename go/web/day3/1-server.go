package main

import (
	"fmt"
	"net/http"
)

// Request结构主要部分
// type Request struct {
// 	Method string
// 	URL *url.URL
// 	Header Header
// 	Body io.ReadCloser
// 	Host string
// 	Form url.Values
// }

// URL结构
// type URL struct {
// 	Scheme     string
// 	Opaque     string   
// 	User       *Userinfo 
// 	Host       string   
// 	Path       string    
// 	RawPath    string    
// 	ForceQuery bool      
// 	RawQuery   string    
// 	Fragment   string    
// }
// URL一般格式:
//		scheme:[userinfo@]host/path[?query][#fragment]

func headers(w http.ResponseWriter, r *http.Request) {
	h := r.Header
	fmt.Fprintln(w, h)
}

func body(w http.ResponseWriter, r *http.Request) {
	len := r.ContentLength
	body := make([]byte, len)
	r.Body.Read(body)
	fmt.Fprintln(w, string(body))
}

func main() {
	server := http.Server{
		Addr: "127.0.0.1:8888",
	}
	http.HandleFunc("/headers", headers)
	http.HandleFunc("/body", body)
	server.ListenAndServe()
}
