package main

import (
	"bytes"
	"encoding/csv"
	"encoding/gob"
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
)

func file() {
	data := []byte("Hello world")

	// #1. 第一种方式
	err := ioutil.WriteFile("data1", data, 0644)
	if err != nil {
		panic(err)
	}

	read1, _ := ioutil.ReadFile("data1")
	fmt.Print(string(read1))

	// #2. 第二种方式
	file1, _ := os.Create("data2")
	// 使用defer关闭文件是一种值得提倡的做法, 它杜绝了用户在使用文件之后忘记关闭文件的问题.
	// defer语句可以将给定的函数调用推入到一个栈里面, 保存在栈中的调用会在包含defer语句的函数返回之后执行
	defer file1.Close()

	bytes, _ := file1.Write(data)
	fmt.Printf("Wrote %d bytes to file\n", bytes)

	file2, _ := os.Open("data2")
	defer file2.Close()

	read2 := make([]byte, len(data))
	bytes, _ = file2.Read(read2)
	fmt.Printf("Read %d bytes from file\n", bytes)
	fmt.Println(string(read2))
}

type Post struct {
	Id      int
	Content string
	Author  string
}

// 使用csv
func csvDemo() {
	csvFile, err := os.Create("posts.csv")
	if err != nil {
		panic(err)
	}
	defer csvFile.Close()

	allPosts := []Post{
		Post{Id: 1, Content: "hello", Author: "fgoll"},
		Post{Id: 2, Content: "Emmmmmm", Author: "ccc"},
		Post{Id: 3, Content: "eeeeeeeeee", Author: "perdo"},
		Post{Id: 4, Content: "greeting", Author: "fgoll"},
	}

	writer := csv.NewWriter(csvFile)
	for _, post := range allPosts {
		line := []string{strconv.Itoa(post.Id), post.Content, post.Author}
		err := writer.Write(line)
		if err != nil {
			panic(err)
		}
	}

	writer.Flush()

	file, err := os.Open("posts.csv")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.FieldsPerRecord = -1
	record, err := reader.ReadAll()
	if err != nil {
		panic(err)
	}

	var posts []Post
	for _, item := range record {
		id, _ := strconv.ParseInt(item[0], 0, 0)
		post := Post{Id: int(id), Content: item[1], Author: item[2]}
		posts = append(posts, post)
	}

	fmt.Println(posts[0].Id)
	fmt.Println(posts[0].Content)
	fmt.Println(posts[0].Author)
}

// 使用gob
func store(data interface{}, filename string) {
	buffer := new(bytes.Buffer)
	encoder := gob.NewEncoder(buffer)
	err := encoder.Encode(data)
	if err != nil {
		panic(err)
	}
	err = ioutil.WriteFile(filename, buffer.Bytes(), 0600)
	if err != nil {
		panic(err)
	}
}

func load(data interface{}, filename string) {
	raw, err := ioutil.ReadFile(filename)
	if err != nil {
		panic(err)
	}
	buffer := bytes.NewBuffer(raw)
	dec := gob.NewDecoder(buffer)
	err = dec.Decode(data)
	if err != nil {
		panic(err)
	}
}

func gobDemo() {
	post := Post{Id: 1, Content: "hello", Author: "fgoll"}
	store(post, "post1")

	var postRead Post
	load(&postRead, "post1")
	fmt.Println(postRead)
}

func main() {
	gobDemo()
}
