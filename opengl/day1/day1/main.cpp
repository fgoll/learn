#include <GL/glut.h>

GLsizei winWidth = 600, winHeight = 500;
GLint xRaster = 25, yRaster = 150;

GLubyte label[36] = { 'J','a','n', 'F','e','b', 'M','a','r',
					 'A','p','r', 'M','a','y', 'J','u','n',
					 'J','u','l', 'A','u','g', 'S','e','p',
					 'O','c','t', 'N','o','v', 'D','e','c' };
GLint dataValue[12] = { 420, 342, 324, 310, 262, 185, 190, 196, 217, 240, 312, 438 };

typedef struct { float x, y; } wcPt2D;

wcPt2D dataPts[5];

void init(void) {
	glClearColor(1.0, 1.0, 1.0, 0.0);   //  sets the colour to clear the buffer
	glMatrixMode(GL_PROJECTION);    //
	// 在没调用gluOthor2d函数之前，坐标范围是 X:-1~1,Y:-1~1；调用了这个函数之后坐标范围是 X:0~WIDTH,Y:0~HEIGHT
	gluOrtho2D(0.0, 600.0, 0.0, 500.0); // 定义剪裁面
}

void winReshapeFcn(GLint newWidth, GLint newHeight) {
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	gluOrtho2D(0.0, newWidth, 0.0, newHeight);
	glClear(GL_COLOR_BUFFER_BIT);
}

// 折线图
void lineGraph(void) {
	GLint month, k;
	GLint x = 30;

	glClear(GL_COLOR_BUFFER_BIT);
	glColor3f(0.0, 0.0, 1.0);

	glEnable(GL_LINE_STIPPLE);

	glLineStipple(1, 0x00FF);

	glBegin(GL_LINE_STRIP);
	for (k = 0; k < 12; k++) {
		glVertex2i(x + k * 50, dataValue[k]);
	}

	glEnd();

	glDisable(GL_LINE_STIPPLE);


	glColor3f(1.0, 0.0, 0.0);
	for (k = 0; k < 12; k++) {
		glRasterPos2i(xRaster + k * 50, dataValue[k] - 4);
		glutBitmapCharacter(GLUT_BITMAP_9_BY_15, '*');
	}

	glColor3f(0.0, 0.0, 0.0);
	int xr = 20;

	for (month = 0; month < 12; month++) {
		glRasterPos2i(xr, yRaster);
		for (k = 3 * month; k < 3 * month + 3; k++) {
			glutBitmapCharacter(GLUT_BITMAP_HELVETICA_12, label[k]);
		}
		xr += 50;
	}

	glFlush();
}

// 直方图
void barChart(void) {
	GLint month, k;
	glClear(GL_COLOR_BUFFER_BIT);

	glColor3f(1.0, 0.0, 0.0);
	for (k = 0; k < 12; k++) {
		glRecti(20 + k * 50, 165, 40 + k * 50, dataValue[k]);
	}

	glColor3f(0.0, 0.0, 0.0);
	xRaster = 20;

	for (month = 0; month < 12; month++) {
		glRasterPos2i(xRaster, yRaster);

		for (k = 3 * month; k < 3 * month + 3; k++) {
			glutBitmapCharacter(GLUT_BITMAP_HELVETICA_12, label[k]);
		}
		xRaster += 50;
	}

	glFlush();
}

// 线段
void lineSegment(void) {
	glClear(GL_COLOR_BUFFER_BIT);   // clears the buffer
	glColor3f(0.0, 0.4, 0.2);   // 设置对象颜色

	int vertex1[] = { 200, 100 };
	int vertex2[] = { 50, 250 };
	glBegin(GL_LINES);
	glVertex2i(180, 25);
	glVertex2i(10, 145);

	glEnd();
	glFlush();
}

void main(int argc, char** argv) {
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);
	glutInitWindowPosition(1200, 100);
	glutInitWindowSize(winWidth, winHeight);
	glutCreateWindow("first day of OpenGL");

	init();
	glutDisplayFunc(lineGraph);
	glutReshapeFunc(winReshapeFcn); // 通常是为了避免在窗口大小变化的过程中显示的内容扭曲失真
	glutMainLoop();
}

