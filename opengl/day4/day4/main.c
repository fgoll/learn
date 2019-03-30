//
//  main.c
//  day4
//
//  Created by 江宏 on 2019/3/30.
//  Copyright © 2019 江宏. All rights reserved.
//

#include <stdio.h>
#include <GLUT/GLUT.h>

#define true 1
#define false 0

struct wcPt2D {
    GLfloat x, y;
};

const GLint winLeftBitCode = 0x1;
const GLint winRightBitCode = 0x2;
const GLint winBottomBitCode = 0x4;
const GLint winTopBitCode = 0x8;

GLint inside(GLint code) { return (GLint)!code; }
// 两端在窗口外
GLint reject(GLint code1, GLint code2) { return (GLint)(code1 & code2); }
// 两端都在窗口内
GLint accept1(GLint code1, GLint code2) { return (GLint)!(code1 | code2); }

GLubyte encode(struct wcPt2D pt, struct wcPt2D winMin, struct wcPt2D winMax) {
    GLubyte code = 0x00;
    if (pt.x < winMin.x) {
        code = code | winLeftBitCode;
    }
    if (pt.x > winMax.x) {
        code = code | winRightBitCode;
    }
    if (pt.y < winMin.y) {
        code = code | winBottomBitCode;
    }
    if (pt.y > winMax.y) {
        code = code | winTopBitCode;
    }
    return code;
}

void swapPts(struct wcPt2D *p1, struct wcPt2D *p2) {
    struct wcPt2D tmp;
    tmp = *p1;
    *p1 = *p2;
    *p2 = tmp;
}

void swapCodes(GLubyte *c1, GLubyte *c2) {
    GLubyte tmp;
    tmp = *c1;
    *c1 = *c2;
    *c2 = tmp;
}

void line(GLint x,GLint y,GLint x1,GLint y1) {
    
    glBegin(GL_LINES);
    glVertex2i(x, y);
    glVertex2i(x1, y1);
    glEnd();
}

void lineClipCohSuth(struct wcPt2D winMin, struct wcPt2D winMax, struct wcPt2D p1, struct wcPt2D p2) {
    GLubyte code1, code2;
    
    glColor3f(0, 0, 1);
    glRectf(winMin.x, winMin.y, winMax.x, winMax.y);
    
    GLint done = false, plotLine = false;
    GLfloat m = 0;
    
    while (!done) {
        code1 = encode(p1, winMin, winMax);
        code2 = encode(p2, winMin, winMax);
        
        if (accept1(code1, code2)) {
            done = true;
            plotLine = true;
        }else {
            if (reject(code1, code2)) {
                done = true;
            }else {
                if (inside(code1)) {
                    // 保证在显示窗口外的点是p1
                    swapPts(&p1, &p2);
                    swapCodes(&code1, &code2);
                }
                
                if (p2.x != p1.x) {
                    m = (p2.y - p1.y) / (p2.x - p1.x);
                }
                
                if (code1 & winLeftBitCode) { // 与winMin垂直边的交点
                    p1.y += (winMin.x - p1.x) * m;
                    p1.x = winMin.x;
                }else {
                    if (code1 & winRightBitCode) {
                        p1.y += (winMax.x - p1.x) * m;
                        p1.x = winMax.x;
                    }else {
                        if (code1 & winBottomBitCode) {
                            if (p2.x != p1.x)
                                p1.x += (winMin.y - p1.y) / m;
                            p1.y = winMin.y;
                        }else {
                            if (p2.x != p1.x)
                                p1.x += (winMax.y - p1.y) / m;
                            p1.y = winMax.y;
                        }
                    }
                }
            }
        }
    }
    if (plotLine) {
        glColor3f(1.0, 0.0, 0.0);
        line(round(p1.x), round(p1.y), round(p2.x), round(p2.y));
    }
}

void init(void) {
    glClearColor(1.0, 1.0, 1.0, 0.0);
    glMatrixMode(GL_PROJECTION);
    
    gluOrtho2D(-100.0, 100.0, -100.0, 100.0);
    glMatrixMode(GL_MODELVIEW);
}

void triangle(struct wcPt2D verts[]) {
    GLint k;
    
    glBegin(GL_TRIANGLES);
        for (k = 0; k < 3; k ++) {
            glVertex2f(verts[k].x, verts[k].y);
        }
    glEnd();
}

void displayFcn(void) {
    struct wcPt2D verts[3] = {{-50.0, -25.0}, {50.0, -25.0}, {0.0, 50.0}};
    
    struct wcPt2D p1 = {50, 50};
    struct wcPt2D p2 = {0, 0};
    struct wcPt2D winMin = {10, 10};
    struct wcPt2D winMax = {25, 25};
    
    glClear(GL_COLOR_BUFFER_BIT);
    
    glColor3f(0.0, 0.0, 1.0);
    
    glViewport(0, 0, 300, 300);
    line(p1.x, p1.y, p2.x, p2.y);
//    triangle(verts);
    
    glColor3f(1.0, 0.0, 0.0);
    
    glViewport(300, 0, 300, 300);
    lineClipCohSuth(winMin, winMax, p1, p2);
    
//    glRotatef(90.0, 0.0, 0.0, 1.0);
    
//    triangle(verts);
    
    
    
    glFlush();
}

int main(int argc, const char * argv[]) {
    // insert code here...
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);
    glutInitWindowPosition(50, 50);
    glutInitWindowSize(600, 300);
    glutCreateWindow("day4");
    init();
    glutDisplayFunc(displayFcn);
    glutMainLoop();
    return 0;
}
