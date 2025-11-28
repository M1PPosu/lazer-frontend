export const howToJoinPage = {
  "howToJoin": {
    "title": "如何加入服务器",
    "subtitle": "有两种方式可以连接到我们的服务器",
    "copyFailed": "复制失败：",
    "clickToCopy": "点击复制",
    "method1": {
      "title": "使用我们的自定义启动器",
      "recommended": "推荐",
      "description": "此方法推荐所有用户使用。",
      "steps": {
        "title": "步骤：",
        "step1": {
          "title": "下载 M1PPosu 启动器",
          "pcVersion": "PC 版本：",
          //"androidVersion": "Android Version (4ayo??):",
          "downloadPc": "从 GitHub Releases 下载",
          //"downloadAndroidDomestic": "Download (China Only)",
          //"downloadAndroidOverseas": "Download (For global network)"
        },
        "step2": {
          "title": "启动游戏，前往 设置 → Rulesets，在「Custom API Server URL」栏中输入：",
          "description": "在 osu!lazer 设置中进入「Online」部分，找到「Custom API Server URL」设置，并在输入框中填写以下内容：",
          "imageHint": "如图所示"
        },
        "step3": {
          "title": "重启游戏并尽情游玩！",
          "description": "输入 URL 后，退出 osu!lazer 并重新启动，以使更改生效。"
        }
      }
    },
    "method2": {
      "title": "使用 LazerAuthlibInjection（仅限 x86_64 平台）",
      "suitableFor": "此方法适用于以下用户：",
      "platforms": {
        "windows": "Windows 用户。（暂不支持 WOA）",
        "linux": "任意 Linux 发行版。（不支持 arm64 及其他 arm 设备）",
        "mac": "macOS。（不支持 Apple Silicon）"
      },
      "steps": {
        "title": "步骤：",
        "step1": {
          "title": "下载 LazerAuthlibInjection",
          "download": "从 GitHub Releases 下载",
          "button": "下载 LazerAuthlibInjection"
        },
        "step2": {
          "title": "将其作为 ruleset 安装到 osu!lazer 中",
          "description": "将下载好的 LazerAuthlibInjection 作为规则集安装到 osu!lazer 中"
        },
        "step3": {
          "title": "启动游戏，前往 设置 → Game Mode，并输入以下信息：",
          "description": "在游戏设置中配置服务器连接信息",
          "apiUrl": "API 地址：",
          "websiteUrl": "网站地址："
        },
        "step4": {
          "title": "看到 “API Settings Changed” 提示后，重启客户端并尽情游玩！",
          "description": "完成以上设置后，重启客户端以连接到服务器"
        }
      },
      "warning": {
        "title": "重要提示",
        "description": "尽管 peppy（ppy）已明确表示 ruleset 不受反作弊检测影响，但我们强烈建议你不要在安装 AuthLibInject 的情况下将 osu!lazer 客户端连接至官方服务器，否则你的账号可能会被封禁！"
      }
    }
  },
} as const;
