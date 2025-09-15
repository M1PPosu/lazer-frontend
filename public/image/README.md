# 图像资源目录结构

此目录已重新整理，按功能分类存放图像资源。

## 目录结构

```
image/
├── backgrounds/        # 背景图片
│   └── bgcover.jpg    # 默认封面背景
├── grades/            # 游戏评级图标
│   ├── GradeSmall-SS.svg
│   ├── GradeSmall-S.svg
│   ├── GradeSmall-A.svg
│   ├── GradeSmall-B.svg
│   ├── GradeSmall-C.svg
│   ├── GradeSmall-D.svg
│   ├── GradeSmall-F.svg
│   ├── GradeSmall-SS-Silver.svg
│   └── GradeSmall-S-Silver.svg
├── logos/             # 品牌标识
│   ├── logo.svg      # 主 Logo SVG
│   ├── logo.png      # 主 Logo PNG
│   └── lazer.png     # Lazer 标识
├── ui/                # 用户界面元素
│   ├── card-image1.svg
│   ├── card-image2.svg
│   ├── ...
│   └── card-image8.svg
├── flag/              # 国家/地区旗帜
│   ├── cn.svg
│   ├── us.svg
│   └── ...
├── mods/              # 游戏模组图标
│   ├── mod-hidden.svg
│   ├── mod-hard-rock.svg
│   └── ...
└── team-types/        # 团队类型图标
    ├── head_to_head.svg
    ├── tag_coop.svg
    └── ...
```

## 使用说明

- **grades/**: 包含所有游戏评级图标，用于显示玩家成绩
- **backgrounds/**: 存放背景图片，如用户封面默认图
- **logos/**: 品牌相关的标识文件
- **ui/**: 用户界面中使用的装饰性图标
- **flag/**: 国家和地区的旗帜图标
- **mods/**: osu! 游戏模组的图标
- **team-types/**: 多人游戏团队类型图标

## 文件命名规范

- 评级图标：`GradeSmall-{Grade}.svg`
- 模组图标：`mod-{name}.svg`  
- 国家旗帜：`{country-code}.svg`
- UI 卡片：`card-image{number}.svg`

## 注意事项

所有路径引用已更新为新的目录结构。如需添加新图像，请遵循相应的分类和命名规范。