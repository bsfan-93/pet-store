# fix-case.ps1

$viewsPath = "src/views"

# 1. 获取所有 .vue 文件
$files = Get-ChildItem $viewsPath -Filter *.vue

# 2. 遍历并执行 rename → rename 回原名
foreach ($file in $files) {
    $original = $file.FullName
    $temp = "$($file.FullName)_tmp"

    Rename-Item -Path $original -NewName ($file.Name + "_tmp")
    Rename-Item -Path $temp -NewName $file.Name
}

# 3. Git 操作
git add .
git commit -m "fix: force Git to recognize case-sensitive file changes"
git push origin main
