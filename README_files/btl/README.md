1. 将mobile文件夹放在snowy-plugin-gen插件中的resources中
2. 调整GenBasicServiceImpl中的GEN_MOBILE_FILE_LIST常量

```java
private static final List<JSONObject> GEN_MOBILE_FILE_LIST = CollectionUtil.newArrayList(
        JSONUtil.createObj().set("name", "page.json.btl"),
		JSONUtil.createObj().set("name", "Api.js.btl").set("path", "api"),
		JSONUtil.createObj().set("name", "search.vue.btl").set("path",  "pages"),
		JSONUtil.createObj().set("name", "form.vue.btl").set("path",  "pages"),
		JSONUtil.createObj().set("name", "more.vue.btl").set("path",  "pages"),
		JSONUtil.createObj().set("name", "index.vue.btl").set("path",  "pages")
);
```