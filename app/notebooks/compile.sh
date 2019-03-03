 #!/bin/bash

for file in *.ipynb
do 
	jupyter nbconvert --to script  "${file}"
done

rm  ../recommender/*
mv *.py ../recommender/




