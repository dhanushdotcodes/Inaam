.PHONY: commit add status

status:
	git status

add:
	git add .

commit:
	git commit -m "$(m)"
