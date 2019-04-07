//
//  main.c
//  day9
//
//  Created by 江宏 on 2019/4/7.
//  Copyright © 2019 江宏. All rights reserved.
//

#include <stdio.h>
#include <GLUT/GLUT.h>
#include <stdlib.h>

GLsizei winWidth = 600, winHeight = 600;

GLfloat xwcMin = -50.0, xwcMax = 50.0;
GLfloat ywcMin = -50.0, ywcMax = 50.0;

struct wcPt3D {
    GLfloat x, y, z;
};

void init(void) {
    glClearColor(1.0, 1.0, 1.0, 0.0);
}

void plotPoint(struct wcPt3D bezCurvePt) {
    glBegin(GL_POINTS);
        glVertex2f(bezCurvePt.x, bezCurvePt.y);
    glEnd();
}

void binomialCoeffs(GLint n, GLint *C) {
    GLint k, j;
    
    // 计算 n!/(k!(n-k)!)
    for (k = 0; k <= n; k ++) {
        C[k] = 1;
        
        for (j = n; j >= k + 1; j--) {
            C[k] *= j;
        }
        
        for (j = n - k; j >= 2; j --) {
            C[k] /= j;
        }
    }
}

void computeBezPt(GLfloat u, struct wcPt3D *bezPt, GLint nCtrlPts, struct wcPt3D *ctrlPts, GLint *C) {
    GLint k, n = nCtrlPts - 1;
    
    GLfloat bezBlendFcn;
    
    bezPt->x = bezPt->y = bezPt->z = 0.0;
    
    for (k = 0; k < nCtrlPts; k ++) {
        bezBlendFcn = C[k] * pow(u, k) * pow(1-u, n-k);
        
        bezPt->x += ctrlPts[k].x * bezBlendFcn;
        bezPt->y += ctrlPts[k].y * bezBlendFcn;
        bezPt->z += ctrlPts[k].z * bezBlendFcn;
    }
}

void bezier(struct wcPt3D *ctrlPts, GLint nCtrlPts, GLint nBezCurvePts) {
    struct wcPt3D bezCurvePt;
    
    GLfloat u;
    GLint *C, k;
    C = (GLint *)malloc(nCtrlPts * sizeof(GLint));
    
    binomialCoeffs(nCtrlPts - 1, C);
    
    for (k = 0; k <= nBezCurvePts; k ++) {
        u = (GLfloat)k / (GLfloat)nBezCurvePts;
        computeBezPt(u, &bezCurvePt, nCtrlPts, ctrlPts, C);
        plotPoint(bezCurvePt);
    }
    
    free(C);
    C = NULL;
}

void displayFcn(void) {
    
    
    GLint nCtrlPts = 4, nBezCurvePts = 1000;
    
    struct wcPt3D ctrlPts[4] = { {-40.0, -40.0, 0.0}, {-10.0, 200.0, 0.0},
        {10.0, -200.0, 0.0}, {40.0, 40.0, 0.0} };
    
    glClear(GL_COLOR_BUFFER_BIT);
    
    glPointSize(4);
    glColor3f(1.0, 0.0, 0.0);
    
    bezier(ctrlPts, nCtrlPts, nBezCurvePts);
    
    glFlush();
}

void winReshapeFcn(GLint newWidth, GLint newHeight) {
    glViewport(0, 0, newWidth, newHeight);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluOrtho2D(xwcMin, xwcMax, ywcMin, ywcMax);
    glClear(GL_COLOR_BUFFER_BIT);
}

int main(int argc, const char * argv[]) {
    // insert code here...
    glutInit(&argc, argv);
    
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);
    
    glutInitWindowSize(winWidth, winHeight);
    
    glutInitWindowPosition(50, 50);
    
    glutCreateWindow("day9");
    
    init();
    
    glutDisplayFunc(displayFcn);
    glutReshapeFunc(winReshapeFcn);
    
    glutMainLoop();
    
    return 0;
}
