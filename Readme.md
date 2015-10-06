# About
This repo contains code to apply topic modeling on the SuperUserForum.

# Running




# Reproducing the results



1) Download dataset
Dump was downloaded from [archive.org](https://archive.org/download/stackexchange/superuser.com.7z)

Save and the folder to 'data' folder
The data folder should have a file Posts.xml



2) Build sqlitedb
The xml file is huge and not easily accesible. In its current format, it is hard to get an entire page (question and answers)
The script analysis/makdeb.py makes a sqlite database

```
python analysis/makedb.py data/Posts.xml data/data.sqlite
```

3) Train Gensim
