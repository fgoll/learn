package main

import (
	"encoding/json"
	"fmt"
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

func MarshalIndent() {
	post := Post{
		Id:      1,
		Content: "Hello world",
		Author: Author{
			Id:   2,
			Name: "fgoll",
		},
		Comments: []Comment{
			Comment{
				Id:      3,
				Content: "Have a great day",
				Author:  "adm",
			},
			Comment{
				Id:      4,
				Content: "How are you today",
				Author:  "betty",
			},
		},
	}

	output, err := json.MarshalIndent(&post, "", "\t\t")
	if err != nil {
		fmt.Println("Error marshalling to JSON: ", err)
		return
	}
	err = ioutil.WriteFile("2-json.json", output, 0644)
	if err != nil {
		fmt.Println("Error writing JSON to file: ", err)
		return
	}
}

func Encode() {
	post := Post{
		Id:      1,
		Content: "Hello world",
		Author: Author{
			Id:   2,
			Name: "fgoll",
		},
		Comments: []Comment{
			Comment{
				Id:      3,
				Content: "Have a great day",
				Author:  "adm",
			},
			Comment{
				Id:      4,
				Content: "How are you today",
				Author:  "betty",
			},
		},
	}

	jsonFile, err := os.Create("2-json.json")
	if err != nil {
		fmt.Println("Error creating JSON file: ", err)
		return
	}

	encoder := json.NewEncoder(jsonFile)
	err = encoder.Encode(&post)
	if err != nil {
		fmt.Println("Error encoding JSON to file: ", err)
		return
	}
}

func main() {
	Encode()
}
