<!-- title:Git 回滚到旧的提交 -->
<!-- keywords:Git -->

`git reset`，会清除 commit 记录，一般在仓库还没提交到远程时使用

```bash
# ~ 加数字指回滚最近几次的提交
git reset --hard HEAD~1
# 强制推送
git push -f origin master
```

`git revert`，不会清除 commit 记录，而且会添加一条新的 commit 记录指明此次提交为回滚操作，一般当提交到远程仓库后要回滚避免冲突时使用

```bash
# 连续回滚最近几次的提交并合并为一次提交，例如回滚最近 9 次提交 (注意是连续的)
git revert --no-commit HEAD~9..HEAD
git commit -m "Revert to old commit"
# 连续回滚最近几次的提交并为每次回滚产生新的提交
git revert --no-edit HEAD~9..HEAD
# 单次提交
git revert --no-edit HEAD~1
# 根据 commit id 回滚提交
git log
git revert --no-edit commit_id
```

不加 `--no-edit` 参数的话，回车之后只显示一个空白窗口，不知道为什么

---

## 参考

[Revert multiple git commits](https://stackoverflow.com/questions/1463340/revert-multiple-git-commits)