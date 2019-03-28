//
//  main.c
//  day2
//
//  Created by 江宏 on 2019/3/28.
//  Copyright © 2019 江宏. All rights reserved.
//

#include <stdio.h>
#include <GLUT/glut.h>
#include <stdlib.h>

void init(void) {
    glClearColor(1.0, 1.0, 1.0, 0.0);
    gluOrtho2D(0, 300, 0, 300);
}

void setPixel(int x,int y){
//    glPointSize(5.0f);
    glBegin(GL_POINTS);
    glVertex2i(x,y);
    glEnd();
    glFlush();
}

//
//int round(a) {
//    return (int)(a + 0.5);
//}

void lineDDA(int x0, int y0, int xEnd, int yEnd) {
    int dx = xEnd - x0, dy = yEnd - y0, steps, k;
    
    float xIncrement, yIncrement, x = x0, y = y0;
    
    if (fabs(dx) > fabs(dy)) {
        steps = fabs(dx);
    }else {
        steps = fabs(dy);
    }
    
    xIncrement = (float)dx / (float)steps;
    yIncrement = (float)dy / (float)steps;
    
    for (k = 0; k < steps; k++) {
        x += xIncrement;
        y += yIncrement;
        
        setPixel((int)(x), (int)(y));
    }
}

void circlePlotPoints(GLint x, GLint y, GLint xc, GLint yc) {
    setPixel(xc + x, yc + y);
    setPixel(xc - x, yc + y);
    setPixel(xc + x, yc - y);
    setPixel(xc - x, yc - y);
    setPixel(xc - y, yc - x);
    setPixel(xc - y, yc + x);
    setPixel(xc + y, yc - x);
    setPixel(xc + y, yc + x);
}

void circleMidpoint(GLint xc, GLint yc, GLint radius) {
    GLint d = 3 - 2 * radius;
    
    GLint x = 0, y = radius;

    
    while (x < y) {
        circlePlotPoints(x, y, xc, yc);
        if (d < 0) {
            d = d + 4 * x + 6;
        }else {
            d = d + 4 * (x - y) + 10;
            y --;
        }
        
        x ++;
    }
}

void test(void) {
    lineDDA(10, 50, 150, 150);
    
    circleMidpoint(50, 50, 30);
}

int main(int argc, const char * argv[]) {
    // insert code here...
    
    glutInit(&argc, argv);
    
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);
    
    glutInitWindowSize(300, 300);
    
    glutInitWindowPosition(50, 100);
    glutCreateWindow("first day of OpenGL");
    init();
    
    glutDisplayFunc(test);
    glutMainLoop();
    
    return 0;
}
