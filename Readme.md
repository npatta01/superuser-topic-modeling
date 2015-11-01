# About
This repo contains code to apply topic modeling on the SuperUserForum using the package gensim

The ipython notebook I used for my analysis can be found [here](analysis/superuser.ipynb)

An interactive view of the project can be found [here](https://superuser-topic-modeling.herokuapp.com/#/topics)

[Slides](http://www.slideshare.net/slideshow/embed_code/key/dGQh9SJb6wKIS9) used when I presented to my class


[Blog Post](http://npatta01.github.io//2015/10/23/superuser_topic_modeling/)

 
  

# Reproducing the results



1) Download dataset
Dump was downloaded from [archive.org](https://archive.org/download/stackexchange/superuser.com.7z)

Save and the folder to 'data' folder
The data folder should have a file Posts.xml



2) Build sqlitedb
The xml file is huge and not easily accesible. In its current format, it is hard to get an entire page (question and answers).

The script analysis/makdeb.py makes a sqlite database

```
python analysis/makedb.py data/Posts.xml data/data.sqlite
```

3) Analyze the results

```
ipython notebook
```

navigate to analysis/superuser.ipynb

# Running the deployed code


1) bower,npm must be installed      

2) Install bower dependencies

```
bower install       
```

3) install node dependencies

```
npm install
```

4) run webapp

```
python runserver.py
```