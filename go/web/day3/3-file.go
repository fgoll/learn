package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

func process(w http.ResponseWriter, r *http.Request) {
	// r.ParseMultipartForm(1024)
	// fmt.Fprintln(w, r.MultipartForm)
	// fileHeader := r.MultipartForm.File["uploaded"][0]

	// file, err := fileHeader.Open()
	// if err == nil {
	// 	if data, err := ioutil.ReadAll(file); err == nil {
	// 		fmt.Fprintln(w, string(data))
	// 	}
	// }

	// 客户端只上传一个文件的情况下
	file, _, err := r.FormFile("uploaded")
	if err == nil {
		if data, err := ioutil.ReadAll(file); err == nil {
			fmt.Fprintln(w, string(data))
		}
	}
}

func main() {
	server := http.Server{
		Addr: "127.0.0.1:8888",
	}
	http.HandleFunc("/process", process)
	server.ListenAndServe()
}