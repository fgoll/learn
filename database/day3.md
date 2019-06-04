## 定义SQL关系
```sql
create table r
  (A1   D1,
   A2   D2,
   ...,
   An   Dn,
   <完整性约束1>
   ...,
   <完整性约束k>)
```
其中r是关系名, 每个Ai是关系r模式中的一个属性名, Di是属性Ai的域, 也就是说Di指定了属性Ai的类型以及可选的约束, 用于限制所允许的Ai取值的集合

完整性约束:
- primary key(A1, A2, ... Am): `primary key`表示属性A1, A2, ..., Am 构成关系的主码. 主码属性必须非空且唯一. 主码的声明是可选的, 但为每个关系指定一个主码通常会更好
- foreign key(A1, A2, ... Am) references: `foreign key`声明表示关系中任意元组在属性(A1, A2, ..., Am)上的取值必须对应于关系s中某元组在主码属性上的取值
- not null: 一个属性上的not null约束表明在该属性上不允许空值

## SQL查询的基本结构
SQL查询的基本结构由三个子句构成: select、from和where

#### 单关系查询

```sql
1. 找出所有教师的名字(教师的名字可以在instructor关系中找到):
select name 
from instructor;
```
```sql
2. 找出所有教师所在的系名:
select dept_name 
from instructor;
```
3. 一个系有多个教师, 所以instructor关系中, 一个系的名称可以出现不止一次, 想要删除重复, 可在`select`后加入关键词`distinct`:
```sql
select distinct dept_name 
from instructor;
```
4. 关键词`all`来显式指明不去除重复
```sql
select all dept_name 
from instructor;
```
5. **select** 子句还可带含有`+`、`-`、`*`、`/`运算符的算术表达式
```sql
返回一个与instructor一样的关系， 只是属性salary是原来的1.1倍
select ID, name, dept_name, salary * 1.1 
from instructor;
```
6. **where** 子句允许我们只选出那些在from子句中的结果关系中满足特定谓词的元组. SQL允许在`where`子句中使用逻辑连词`and`、`or`、`not`. 逻辑连词的运算对象可以是包含比较运算符`<`、`<=`、`>`、`>=`、`=`和`<>`的表达式

#### 多关系查询

```sql
1. 找出所有教师的姓名, 以及他们所在系的名称和系所在建筑的名称(系名在instructor关系的dept_name属性, 系所在建筑的名称在department关系的building属性中):
select name, instructor.dept_name, building
from insctructor, department
where instructor.dept_name = department.dept_name;
```
为了在SQL回答上述查询, 需要访问的关系都列在**from**子句中, 并在**where**子句中指定匹配条件.

通过`from`子句定义了一个在该子句中所列出关系上的笛卡尔积. 可以通过下面的迭代过程理解:
```perl
for each 元组t1 in 关系r1
  for each 元组t2 in 关系r2
    ...
        for each 元组tm in 关系rm
          把t1、t2、...、tm连接成单个元组t
          把t加入结果关系中
```

- 1. 为`from`子句中列出的关系产生笛卡尔积
- 2. 在步骤1的结果上应用上`where`子句中指定的谓词
- 3. 对步骤2结果中的每个元组, 输出`select`子句中指定的属性

#### 自然连接

`自然连接`运算作用于两个关系, 并产生一个关系作为结果. 不同于两个关系上的`笛卡尔积`(将第一个关系中的每个元组和第二个关系中的所有元组都进行连接).  `自然连接`只考虑那些在两个关系模式中都出现的属性值上取值相同的元组对.

```sql
1. 对于在大学中所有讲授课程的教师, 找出他们的姓名以及所讲述的所有课程标识:
select name, course_id
from instructor, teaches
where instructor.ID = teaches.ID;
该查询可以用SQL的自然链接更简洁的写作:
select name, course_id
from instructor natural join teaches;
```

2. 在一个SQL查询的from子句中, 可以用自然连接将多个关系结合在一起, 如下所示:
```sql
select A1, A2, ... An
from r1 natural join r2 natural join ... natural join rm
where P;
```

3. 更为一般的, from 子句可以为如下形式: `from E1, E2, ... En`
其中每个Ei可以是单个关系或一个包含自然连接的表达式.

3.1 列出教师的名字以及他们所讲授课程的名称:
```sql
select name, title 
from instructor natural join teaches, course
where teaches.course_id = course.course_id;
```
3.2 下面的SQL查询不会计算出3.1的结果
```sql
select name, title
from instructor natural join teaches natural join course;
```
因为instructor和teaches的自然连接包括属性(ID, name, dept_name, salary, course_id, sec_id), 而course关系包含的属性是(course_id, title, dept_name, credits). 作为这二者自然连接的结果, 需要来自这两个输入的元组既要在dept_name上取值相同, 还要在course_id上取值相同(系名相同以及课程相同). 故该查询会忽略教师所讲授的课程不是在他所在的系的课程.

4. 为了避免相同属性带来的危险, SQL提供了一种自然连接的构造形式:
```sql
select name, title
from (instructor natural join teaches) join course using (course_id)
```
这样该连接构造允许teaches.dept_name和course.dept_name是不同的.

## 附加的基本运算

#### 更名运算
```sql
select name as instructor_name, course_id
from instructor, teaches
where instructor.ID = teaches.ID;
```
```sql
select T.name, S.course_id
from instructor as T, teaches as S
where T.ID = S.ID;
```
重命名关系的另一个原因是为了适用于需要比较同一个关系中的元组的情况:
```sql
找出工资至少比Biology系某个教师的工资要高的所有老师的名字:
select distinct T.name
from instructor as T, instructor as S
where T.salary > S.salary and S.dept_name = 'Biology'
```

####  字符串运算
- 百分号(%): 匹配任意子串
- 下划线(_): 匹配任意一个字符
- 函数: 不同数据库系统所提供的字符串函数集是不同的

#### select子句中的属性说明

星号`*`可以用在`select`子句中表示"所有的属性".
```sql
表示instructor中的所有属性都被选中: 
select instructor.*
from instructor, teaches
where instructor.ID = teaches.ID;
```

#### 排列元组的显示次序

`order by`子句可用让查询结果中元组按排列顺序显示.
```sql
按字母顺序列出Physics系的所有教师
select name 
from instructor
where dept_name = 'Pyhsics'
order by name;
```
`order by` 子句默认使用升序, 要说明排序顺序, 我们可以用desc表示降序, 或者用asc表示升序. 排序还可在多个属性上进行:
```sql
select * 
from instructor 
order by salary desc, name asc;
```

#### where 子句谓词
1. 为了简化`where`子句, SQL提供`between`比较运算符来说明一个值小于或等于某个值, 同时大于或等于另一个值.
```sql
select name
from instructor
where salary between 90000 and 100000
```
可以取代:
```sql
select name
from instructor
where salary <= 100000 and salary >= 90000
```
2. SQL 允许用记号(v1, v2, ..., vn)来表示一个分量值为v1, v2, ..., vn的n维元组, 在元组上可以运用比较运算符.
```sql
select name, course_id
from instructor, teaches
where (instructor.ID, dept_name) = (teactes.ID, 'Biology');
```

## 集合运算

SQL作用在**关系**上的`union`, `intersect`和`except`运算对应于数学集合论中的∪、∩和-运算。

- 在2009年秋季学期开设的所有课程的集合(**c1**):
  ```sql
  select course_id
  from section
  where semester = 'Fall' and year = 2009;
  ```
- 在2010年春季学期开设的所有课程的集合(**c2**):
  ```sql
  select course_id
  from section
  where semester = 'Spring' and year = 2010;
  ```

#### 并运算
```sql
找出在2009年秋季开课, 或者在2010年春季开课或两个学期都开课的所有课程:
(select course_id
from section
where semester = 'Fall' and year = 2009)
union
(select course_id
from section
where semester = 'Spring' and year = 2010);
```
与`select`子句不同, `union`运算自动去除重复, 如果想保留所有重复, 就必须使用`union all`:
```sql
(select course_id
from section
where semester = 'Fall' and year = 2009)
union all
(select course_id
from section
where semester = 'Spring' and year = 2010);
```

#### 交运算
```sql
找出2009年秋季和2010年春季同时开课的所有课程的集合:
(select course_id
 from section 
 where semester = 'Fall' and year = 2009)
intersect
(select course_id
 from section
 where semester = 'Spring' and year = 2010);
```
`intersect`运算自动去除重复, 如果想保留所有重复, 就必须使用`intersect all`:
```sql
(select course_id
 from section 
 where semester = 'Fall' and year = 2009)
intersect all
(select course_id
 from section
 where semester = 'Spring' and year = 2010);
```

#### 差运算
```sql
找出在2009年秋季学期开课但不在2010年春季学期开学的所有课程:
(select course_id
 from section 
 where semester = 'Fall' and year = 2009)
except
(select course_id
 from section
 where semester = 'Spring' and year = 2010);
```

## 嵌套子查询

子查询是嵌套在另一个查询中的**select-from-where**表达式

```sql
1. 找出在2009年秋季和2010年春季学期同时开课的所有课程(先前通过交运算):
1.1 先找出2010年春季开课的所有课程:
(select course_id
 from section
 where semester = 'Spring' and year = 2010);
1.2 从子查询形成的课程集合中找出那些在2009年秋季开课的课程:
select distinct course_id
from section
where semester = 'Fall' and year = 2009 and 
  course_id in (select course_id
                from section
                where semester = 'Spring' and year = 2010);
```
说明在SQL中可以*用多种方法书写同一查询*.

#### 集合的比较

1. 找出工资至少比Biology系某个教师的工资要高的所有老师的名字:
```sql
先前:
select distinct T.name
from instructor as T, instructor as S
where T.salary > S.salary and S.dept_name = 'Biology'
```
"至少比某一个大" 在SQL中用>some表示:
```sql
select name
from instructor 
where salary > some (select salary
                     from instructor
                     where dept_name = 'Biology');
```
