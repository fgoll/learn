//
//  main.c
//  day8
//
//  Created by 江宏 on 2019/4/4.
//  Copyright © 2019 江宏. All rights reserved.
//

#include <stdio.h>
#include <GLUT/GLUT.h>

GLsizei winWidth = 500, winHeight = 500;

void init(void) {
    glClearColor(1.0, 1.0, 1.0, 0.0);
}

void displayWirePolyhedra(void) {
    glClear(GL_COLOR_BUFFER_BIT);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    glFrustum(-1, 1, -1, 1, 2.0, 20.0);
    
    glColor3f(0.0, 0.0, 1.0);
    gluLookAt(5.0, 5.0, 5.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
    
    glScalef(1.5, 2.0, 1.0);
    glutWireCube(1.0);
    
    glScalef(0.8, 0.5, 0.8);
    glTranslatef(-6.0, -5.0, 0.0);
    glutWireDodecahedron();
    
    glTranslatef(8.6, 8.6, 2.0);
    glutWireTetrahedron();
    
    glTranslatef(-3.0, -1.0, 0.0);
    glutWireOctahedron();
    
    glScalef(0.8, 0.8, 1.0);
    glTranslatef(4.3, -2.0, 0.5);
    glutWireIcosahedron();
    
    glFlush();
}


void winReshapeFcn(GLint newWidth, GLint newHeight) {
    glViewport(0, 0, newWidth, newHeight);
    //
    //
    //    glClear(GL_COLOR_BUFFER_BIT);
}

int main(int argc, char ** argv) {
    // insert code here...
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);
    glutInitWindowSize(winWidth, winHeight);
    glutInitWindowPosition(100, 100);
    glutCreateWindow("day8");
    
    init();
    glutDisplayFunc(displayWirePolyhedra);
    glutReshapeFunc(winReshapeFcn);
    
    glutMainLoop();
    
    return 0;
}
