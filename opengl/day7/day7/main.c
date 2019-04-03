//
//  main.c
//  day7
//
//  Created by 江宏 on 2019/4/3.
//  Copyright © 2019 江宏. All rights reserved.
//

#include <stdio.h>
#include <GLUT/GLUT.h>

const double TWO_PI = 6.2831853;

GLsizei winWidth = 500, winHeight = 500;

GLuint regHex;

static GLfloat rotTheta = 0.0;

struct scrPt {
    GLint x, y;
};

void init (void) {
    struct scrPt hexVertex;
    GLdouble hexTheta;
    GLint k;
    
    glClearColor(1.0, 1.0, 1.0, 0.0);
    //显示列表是一组存储在一起的OpenGL函数,可以在以后执行
    regHex = glGenLists(1);
    glNewList(regHex, GL_COMPILE);
        glColor3f(1.0, 0.0, 0.0);
        glBegin(GL_POLYGON);
            for (k = 0; k < 6; k ++) {
                hexTheta = TWO_PI * k / 6;
                hexVertex.x = 150 + 100 * cos(hexTheta);
                hexVertex.y = 150 + 100 * sin(hexTheta);
                glVertex2i(hexVertex.x, hexVertex.y);
            }
        glEnd();
    glEndList();
}

void displayHex(void) {
    glClear(GL_COLOR_BUFFER_BIT);
    
    glPushMatrix();
    glRotatef(rotTheta, 0.0, 0.0, 1.0);
    glCallList(regHex);
    glPopMatrix();
    
    glutSwapBuffers();
    
    glFlush();
}

void rotateHex(void) {
    rotTheta += 3.0;
    if (rotTheta > 360.0) {
        rotTheta -= 360.0;
    }
    
    //glutPostRedisplay 标记当前窗口需要重新绘制。通过glutMainLoop下一次循环时，窗口显示将被回调以重新显示窗口的正常面板。多次调用glutPostRedisplay，在下一个显示回调只产生单一的重新显示回调
    glutPostRedisplay();
}

void winReshapeFcn(GLint newWidth, GLint newHeight) {
    glViewport(0, 0, newWidth, newHeight);
    
    glMatrixMode(GL_PROJECTION);
    
    glLoadIdentity();
    
    gluOrtho2D(-320.0, 320.0, -320.0, 320.0);
    
    glMatrixMode(GL_MODELVIEW);
    
    glLoadIdentity();
    
    glClear(GL_COLOR_BUFFER_BIT);
}

void mouseFcn(GLint button, GLint action, GLint x, GLint y) {
    switch (button) {
        case GLUT_LEFT_BUTTON:
            if (action == GLUT_DOWN) {
                //glutIdleFunc设置全局的回调函数，当没有窗口事件到达时，GLUT程序功能可以执行后台处理任务或连续动画。如果启用，这个idle function会被不断调用，直到有窗口事件发生。回调函数没有参数。
                glutIdleFunc(rotateHex);
            }
            break;
        case GLUT_RIGHT_BUTTON:
            if (action == GLUT_DOWN) {
                glutIdleFunc(NULL);
            }
        default:
            break;
    }
}

int main(int argc, const char * argv[]) {
    // insert code here...
    
    glutInit(&argc, argv);
    
    glutInitDisplayMode(GL_DOUBLE | GLUT_RGB);
    
    glutInitWindowPosition(150, 150);
    glutInitWindowSize(winWidth, winHeight);
    glutCreateWindow("day7");
    
    init();
    
    glutDisplayFunc(displayHex);
    glutReshapeFunc(winReshapeFcn);
    
    glutMainLoop();
    
    return 0;
}
