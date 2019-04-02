//
//  main.c
//  day6
//
//  Created by 江宏 on 2019/4/1.
//  Copyright © 2019 江宏. All rights reserved.
//

#include <stdio.h>
#include <GLUT/GLUT.h>

typedef GLfloat Matrix4x4[4][4];

GLint winWidth = 600, winHeight = 600;

GLfloat x_0 = 100.0, y_0 = 50.0, z_0 = 50.0;
GLfloat xref = 50.0, yref = 50.0, zref = 0.0;
GLfloat Vx = 0.0, Vy = 1.0, Vz = 0.0;

GLfloat xwMin = -40.0, ywMin = -60.0, xwMax = 40.0, ywMax = 60.0;

GLfloat dnear = 25.0, dfar = 125.0;

void init(void) {
    glClearColor(1.0, 1.0, 1.0, 0.0);
    
    glMatrixMode(GL_MODELVIEW);
    gluLookAt(x_0, y_0, z_0, xref, yref, zref, Vx, Vy, Vz);
    
    glMatrixMode(GL_PROJECTION);
    glFrustum(xwMin, xwMax, ywMin, ywMax, dnear, dfar);
//    gluOrtho2D(0, winWidth, 0, winHeight);
}

void displayFcn(void) {
    glClear(GL_COLOR_BUFFER_BIT);
    
    glColor3f(0.0, 1.0, 0.0);
    
    glPolygonMode(GL_FRONT, GL_FILL);
    glPolygonMode(GL_BACK, GL_LINE);
    
    glBegin(GL_QUADS);
        glVertex3f(0.0, 0.0, 0.0);
        glVertex3f(100.0, 0.0, 0.0);
        glVertex3f(100.0, 100.0, 0.0);
        glVertex3f(0.0, 100.0, 0.0);
    glEnd();
    
    glFlush();
}

void reshapeFcn(GLint newWidth, GLint newHeight) {
    glViewport(0, 0, newWidth, newHeight);
    
    winWidth = newWidth;
    winHeight = newHeight;

}


void matrix4x4SetIdentity(Matrix4x4 matIdent4x4) {
    GLint row, col;

    
    for (row = 0; row < 4; row ++) {
        for (col = 0; col < 4; col ++) {
            matIdent4x4[row][col] = (row == col);
        }
    }
}

void translate3D(GLfloat tx, GLfloat ty, GLfloat tz) {
    Matrix4x4 matTransl3D;
    
    matrix4x4SetIdentity(matTransl3D);
    
    matTransl3D[0][3] = tx;
    matTransl3D[1][3] = ty;
    matTransl3D[2][3] = tz;
}

int main(int argc, const char * argv[]) {
    // insert code here...
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);
    glutInitWindowSize(winWidth, winHeight);
    glutInitWindowPosition(50, 50);
    glutCreateWindow("day6");
    init();
    glutDisplayFunc(displayFcn);
    glutReshapeFunc(reshapeFcn);
    glutMainLoop();
    return 0;
}
