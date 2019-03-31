//
//  main.c
//  day5
//
//  Created by 江宏 on 2019/3/31.
//  Copyright © 2019 江宏. All rights reserved.
//

#include <stdio.h>
#include <GLUT/GLUT.h>

#define true 1
#define false 0

typedef enum {Left, Right, Bottom, Top} Boundary;

const GLint nClip = 4;

struct wcPt2D {
    GLfloat x, y;
};

GLint inside(struct wcPt2D p, Boundary b, struct wcPt2D wMin, struct wcPt2D wMax) {
    switch (b) {
        case Left:
            if (p.x < wMin.x) return false;
            break;
        case Right:
            if (p.x > wMax.x) return false;
            break;
        case Bottom:
            if (p.y < wMin.y) return false;
            break;
        case Top:
            if (p.y > wMax.y) return false;
            break;
    }
    
    return true;
}

GLint cross(struct wcPt2D p1, struct wcPt2D p2, Boundary winEdge, struct wcPt2D wMin, struct wcPt2D wMax) {
    if (inside(p1, winEdge, wMin, wMax) == inside(p2, winEdge, wMin, wMax)) {
        return false;
    }
    return true;
}

struct wcPt2D intersect(struct wcPt2D p1, struct wcPt2D p2, Boundary winEdge, struct wcPt2D wMin, struct wcPt2D wMax) {
    struct wcPt2D iPt;
    GLfloat m;
    
    if (p1.x != p2.x) {
        m = (p1.y - p2.y) / (p1.x - p2.x);
    }
    
    switch (winEdge) {
        case Left:
            iPt.x = wMin.x;
            iPt.y = p2.y + (wMin.x - p2.x) * m;
            break;
        case Right:
            iPt.x = wMax.x;
            iPt.y = p2.y + (wMax.x - p2.x) * m;
            break;
        case Bottom:
            iPt.y = wMin.y;
            if (p1.x != p2.x) iPt.x = p2.x + (wMin.y - p2.y) / m;
            else iPt.x = p2.x;
            break;
        case Top:
            iPt.y = wMax.y;
            if (p1.x != p2.x) iPt.x = p2.x + (wMax.y - p2.y) / m;
            else iPt.x = p2.x;
            break;
    }
    
    return iPt;
}



void clipPoint(struct wcPt2D p, Boundary winEdge, struct wcPt2D wMin, struct wcPt2D wMax,
               struct wcPt2D *pOut, int *cnt, struct wcPt2D *first[], struct wcPt2D *s) {
    struct wcPt2D iPt;

    if (!first[winEdge]) {
        first[winEdge] = &p;
    }else {
        if (cross(p, s[winEdge], winEdge, wMin, wMax)) {
            iPt = intersect(p, s[winEdge], winEdge, wMin, wMax);
            if (winEdge < Top) {
                clipPoint(iPt, winEdge + 1, wMin, wMax, pOut, cnt, first, s);
            }else {
                pOut[*cnt] = iPt;
                (*cnt) ++;
            }
        }
    }
    s[winEdge] = p;
    
    if (inside(p, winEdge, wMin, wMax)) {
        if (winEdge < Top) {
            clipPoint(p, winEdge + 1, wMin, wMax, pOut, cnt, first, s);
        }else {
            pOut[*cnt] = p;
            (*cnt) ++;
        }
    }
}


void closeClip(struct wcPt2D wMin, struct wcPt2D wMax, struct wcPt2D *pOut,
               GLint *cnt, struct wcPt2D *first[], struct wcPt2D *s) {
    struct wcPt2D pt;
    Boundary winEdge;
    
    for (winEdge = Left; winEdge <= Top; winEdge ++) {
        if (cross(s[winEdge], *first[winEdge], winEdge, wMin, wMax)) {
            pt = intersect(s[winEdge], *first[winEdge], winEdge, wMin, wMax);
            if (winEdge < Top) {
                clipPoint(pt, winEdge + 1, wMin, wMax, pOut, cnt, first, s);
            }else {
                pOut[*cnt] = pt;
                (*cnt) ++;
            }
        }
    }
}

GLint polygonClipSuthHodg(struct wcPt2D wMin, struct wcPt2D wMax, GLint n, struct wcPt2D *pIn, struct wcPt2D *pOut) {
    struct wcPt2D *first[nClip] = {0, 0, 0, 0}, s[nClip];
    GLint k, cnt = 0;

    for (k = 0; k < n; k ++) {
        clipPoint(pIn[k], Left, wMin, wMax, pOut, &cnt, first, s);
    }

    closeClip(wMin, wMax, pOut, &cnt, first, s);

    return cnt;
}

void init(void) {
    glClearColor(1, 1, 1, 0);
    glMatrixMode(GL_PROJECTION);
    gluOrtho2D(0, 300, 0, 300);
}

void displayFcn(void) {
    glClear(GL_COLOR_BUFFER_BIT);
    
    struct wcPt2D pIn[4] = {{20, 30}, {100, 80}, { 200, 200}, {40, 150}};
    struct wcPt2D pOut[4];
    struct wcPt2D wMin = {50, 50};
    struct wcPt2D wMax = {150, 150};
    GLint k;
    
    glViewport(0, 0, 300, 300);
    
    glColor3f(0, 1, 1);
    glRectf(wMin.x, wMin.y, wMax.x, wMax.y);
    glColor3f(0, 0, 1);
    glBegin(GL_POLYGON);
    for (k = 0; k < 4; k ++) {
        glVertex2f(pIn[k].x, pIn[k].y);
    }

    glEnd();
    
    glViewport(300, 0, 300, 300);
    
    glColor3f(0, 1, 1);
    glRectf(wMin.x, wMin.y, wMax.x, wMax.y);
    
    GLint n = polygonClipSuthHodg(wMin, wMax, 4, pIn, pOut);
    
    glColor3f(1, 0, 1);
    glBegin(GL_POLYGON);
    for (k = 0; k < n; k ++) {
        glVertex2f(pOut[k].x, pOut[k].y);
    }
    
    glEnd();
    
    glFlush();
}

int main(int argc, const char * argv[]) {
    // insert code here...
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);
    glutInitWindowSize(600, 300);
    glutInitWindowPosition(50, 50);
    glutCreateWindow("day5");
    init();
    glutDisplayFunc(displayFcn);
    glutMainLoop();
    
    return 0;
}
