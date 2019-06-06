package main

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"os"
)

type Post struct {
	Id       int       `json:"id"`
	Content  string    `json:"content"`
	Author   Author    `json:"author"`
	Comments []Comment `json:"comments"`
}

type Author struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type Comment struct {
	Id      int    `json:"id"`
	Content string `json:"content"`
	Author  string `json:"author"`
}

// 如果JSON数据来源于io.Reader流, 如http.Request的Body, 那么使用Decoder更好
// 如果JSON数据来源于字符串或者内存的某个地方, 那么使用Unmarshal更好

func Unmarshal() {
	jsonFile, err := os.Open("1-json.json")
	if err != nil {
		fmt.Println("Error opening JSON file: ", err)
		return
	}
	defer jsonFile.Close()

	jsonData, err := ioutil.ReadAll(jsonFile)
	if err != nil {
		fmt.Println("Error reading JSON data: ", err)
		return
	}
	var post Post
	json.Unmarshal(jsonData, &post)
	fmt.Println(post)
}

func Decoder() {
	jsonFile, err := os.Open("1-json.json")
	if err != nil {
		fmt.Println("Error opening JSON file: ", err)
		return
	}
	defer jsonFile.Close()

	decoder := json.NewDecoder(jsonFile)
	for {
		var post Post
		err := decoder.Decode(&post)
		if err == io.EOF {
			break
		}
		if err != nil {
			fmt.Println("Error decoding JSON: ", err)
			return
		}
		fmt.Println(post)
	}
}

func main() {
	Decoder()
}
