package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/ArthurKnoep/emby-sync/pkg/socket"
)

func GinMiddleware(allowOrigin string) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", allowOrigin)
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type, Content-Length, X-CSRF-Token, Token, session, Origin, Host, Connection, Accept-Encoding, Accept-Language, X-Requested-With")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Request.Header.Del("Origin")

		c.Next()
	}
}

func main() {
	router := gin.New()
	server, err := socket.New()
	if err != nil {
		log.Fatal(err)
	}
	server.Handle()
	go server.Run()
	defer server.Close()
	router.Use(GinMiddleware("*"))
	server.HandleGin(router)
	router.StaticFS("/public", http.Dir("../asset"))

	router.Run()
}
