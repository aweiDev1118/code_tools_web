import{_ as X}from"./index-B3wl7w49.js";/* empty css                        *//* empty css                    */import"./el-tooltip-l0sNRNKZ.js";/* empty css                  *//* empty css                     *//* empty css               *//* empty css                   *//* empty css                    *//* empty css                *//* empty css                 *//* empty css                  */import{c as S}from"./clipboard-DPUjUhfa.js";import{af as J,ab as Z,ac as ee,at as te,au as ae,an as le,av as se,aw as ie,ax as ne,ay as oe,aj as N,ai as re}from"./element-plus-D7m21P0W.js";import{v as me,r as $,c as A,B as w,D as t,O as s,F as n,K as o,I as P,L as B,y as ce,z as x}from"./vue-vendor-SDd1IgNx.js";const pe={class:"max-w-7xl mx-auto"},ue={class:"grid grid-cols-1 lg:grid-cols-2 gap-4"},de={class:"flex items-center justify-between"},ye={class:"flex gap-2"},Te={class:"grid grid-cols-2 gap-4 mb-4"},be={class:"mb-4"},ve={class:"mb-2 flex justify-end"},Ee={class:"mb-2 flex justify-end"},fe={class:"mb-2 flex justify-end"},Me={key:0,class:"mt-4"},Le=me({__name:"MyBatisGenerator",setup(Ne){const M=$(""),E=$("com.example.entity"),C=$("com.example.mapper"),h=$("entity"),u=$(null),U={bigint:"Long",int:"Integer",integer:"Integer",tinyint:"Integer",smallint:"Integer",mediumint:"Integer",float:"Float",double:"Double",decimal:"BigDecimal",numeric:"BigDecimal",bit:"Boolean",boolean:"Boolean",char:"String",varchar:"String",text:"String",tinytext:"String",mediumtext:"String",longtext:"String",json:"String",date:"LocalDate",time:"LocalTime",datetime:"LocalDateTime",timestamp:"LocalDateTime",year:"Integer",blob:"byte[]",tinyblob:"byte[]",mediumblob:"byte[]",longblob:"byte[]",binary:"byte[]",varbinary:"byte[]"},V={bigint:"BIGINT",int:"INTEGER",integer:"INTEGER",tinyint:"TINYINT",smallint:"SMALLINT",mediumint:"INTEGER",float:"FLOAT",double:"DOUBLE",decimal:"DECIMAL",numeric:"NUMERIC",bit:"BIT",boolean:"BOOLEAN",char:"CHAR",varchar:"VARCHAR",text:"LONGVARCHAR",tinytext:"VARCHAR",mediumtext:"LONGVARCHAR",longtext:"LONGVARCHAR",json:"VARCHAR",date:"DATE",time:"TIME",datetime:"TIMESTAMP",timestamp:"TIMESTAMP",year:"INTEGER",blob:"BLOB",tinyblob:"BLOB",mediumblob:"BLOB",longblob:"BLOB",binary:"BINARY",varbinary:"VARBINARY"},O=l=>l.toLowerCase().replace(/_([a-z])/g,(e,i)=>i.toUpperCase()),k=l=>{const e=O(l);return e.charAt(0).toUpperCase()+e.slice(1)},K=l=>{const e=l.match(/^(\w+)/);return e?e[1].toLowerCase():"varchar"},F=()=>{if(!M.value.trim()){N.warning("请输入建表 SQL");return}try{const l=M.value,e=l.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?(\w+)[`"]?/i);if(!e)throw new Error("无法解析表名");const i=e[1],r=l.match(/COMMENT\s*=?\s*'([^']+)'\s*;?\s*$/i),c=r?r[1]:"",T=l.match(/PRIMARY\s+KEY\s*\(\s*[`"]?(\w+)[`"]?/i),b=T?T[1].toLowerCase():"",p=[],d=l.match(/\(([\s\S]+)\)/);if(!d)throw new Error("无法解析表定义");const v=d[1].split(",").map(y=>y.trim()).filter(y=>y);for(const y of v){if(/^\s*(PRIMARY|UNIQUE|KEY|INDEX|FOREIGN|CONSTRAINT)/i.test(y))continue;const f=y.match(/^[`"]?(\w+)[`"]?\s+([\w().,]+)/i);if(!f)continue;const m=f[1],L=f[2],j=K(L),a=y.match(/COMMENT\s+'([^']*)'/i),D=a?a[1]:"",z=!/NOT\s+NULL/i.test(y),W=m.toLowerCase()===b||/PRIMARY\s+KEY/i.test(y);p.push({column:m,javaName:O(m),sqlType:L.toUpperCase(),javaType:U[j]||"String",jdbcType:V[j]||"VARCHAR",comment:D,isPrimaryKey:W,nullable:z})}if(p.length===0)throw new Error("未找到字段定义");u.value={tableName:i,className:k(i),comment:c,fields:p},N.success("解析成功")}catch(l){N.error("解析失败: "+l.message)}},g=A(()=>{if(!u.value)return"";const{className:l,tableName:e,comment:i,fields:r}=u.value,c=new Set;c.add("import lombok.Data;");for(const p of r)p.javaType==="BigDecimal"?c.add("import java.math.BigDecimal;"):p.javaType==="LocalDateTime"?c.add("import java.time.LocalDateTime;"):p.javaType==="LocalDate"?c.add("import java.time.LocalDate;"):p.javaType==="LocalTime"&&c.add("import java.time.LocalTime;");const T=r.map(p=>{const d=[];return p.comment&&(d.push("    /**"),d.push(`     * ${p.comment}`),d.push("     */")),d.push(`    private ${p.javaType} ${p.javaName};`),d.join(`
`)}).join(`

`),b=Array.from(c).sort();return`package ${E.value};

${b.join(`
`)}

/**
 * ${i||l}
 * 表名: ${e}
 */
@Data
public class ${l} {

${T}
}
`}),I=A(()=>{if(!u.value)return"";const{className:l}=u.value,e=u.value.fields.find(r=>r.isPrimaryKey),i=(e==null?void 0:e.javaType)||"Long";return`package ${C.value};

import ${E.value}.${l};
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * ${l} Mapper 接口
 */
@Mapper
public interface ${l}Mapper {

    /**
     * 选择性插入
     */
    int insertSelective(${l} record);

    /**
     * 批量选择性插入
     */
    int insertBatchSelective(@Param("list") List<${l}> list);

    /**
     * 根据主键删除
     */
    int deleteByPrimaryKey(${i} id);

    /**
     * 根据主键选择性更新
     */
    int updateByPrimaryKeySelective(${l} record);

    /**
     * 批量根据主键选择性更新
     */
    int updateBatchByPrimaryKeySelective(@Param("list") List<${l}> list);

    /**
     * 根据主键查询
     */
    ${l} selectByPrimaryKey(${i} id);

    /**
     * 根据条件查询数量
     */
    int selectCountByMap(Map<String, Object> map);

    /**
     * 根据条件查询单条
     */
    ${l} selectByMap(Map<String, Object> map);

    /**
     * 根据条件查询列表
     */
    List<${l}> selectListByMap(Map<String, Object> map);
}
`}),R=A(()=>{if(!u.value)return"";const{className:l,tableName:e,fields:i}=u.value,r=i.find(a=>a.isPrimaryKey),c=(r==null?void 0:r.column)||"id",T=(r==null?void 0:r.javaName)||"id",b=(r==null?void 0:r.jdbcType)||"BIGINT",p=i.map(a=>a.column).join(", "),d=i.map(a=>`        <${a.isPrimaryKey?"id":"result"} column="${a.column}" property="${a.javaName}" jdbcType="${a.jdbcType}" />`).join(`
`),_=i.map(a=>`            <if test="${a.javaName} != null">${a.column},</if>`).join(`
`),v=i.map(a=>`            <if test="${a.javaName} != null">#{${a.javaName},jdbcType=${a.jdbcType}},</if>`).join(`
`),y=i.map(a=>a.column).join(", "),f=i.map(a=>`#{item.${a.javaName},jdbcType=${a.jdbcType}}`).join(", "),m=i.filter(a=>!a.isPrimaryKey).map(a=>`            <if test="${a.javaName} != null">${a.column} = #{${a.javaName},jdbcType=${a.jdbcType}},</if>`).join(`
`),L=i.filter(a=>!a.isPrimaryKey).map(a=>`                    <if test="item.${a.javaName} != null">${a.column} = #{item.${a.javaName},jdbcType=${a.jdbcType}},</if>`).join(`
`),j=i.map(a=>`            <if test="${a.javaName} != null">AND ${a.column} = #{${a.javaName},jdbcType=${a.jdbcType}}</if>`).join(`
`);return`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="${C.value}.${l}Mapper">

    <!-- 结果映射 -->
    <resultMap id="BaseResultMap" type="${E.value}.${l}">
${d}
    </resultMap>

    <!-- 基础列 -->
    <sql id="Base_Column_List">
        ${p}
    </sql>

    <!-- 查询条件 -->
    <sql id="Base_Where_Clause">
        <where>
${j}
        </where>
    </sql>

    <!-- 选择性插入 -->
    <insert id="insertSelective" parameterType="${E.value}.${l}">
        INSERT INTO ${e}
        <trim prefix="(" suffix=")" suffixOverrides=",">
${_}
        </trim>
        <trim prefix="VALUES (" suffix=")" suffixOverrides=",">
${v}
        </trim>
    </insert>

    <!-- 批量选择性插入 -->
    <insert id="insertBatchSelective" parameterType="java.util.List">
        INSERT INTO ${e} (${y})
        VALUES
        <foreach collection="list" item="item" separator=",">
            (${f})
        </foreach>
    </insert>

    <!-- 根据主键删除 -->
    <delete id="deleteByPrimaryKey">
        DELETE FROM ${e}
        WHERE ${c} = #{id,jdbcType=${b}}
    </delete>

    <!-- 根据主键选择性更新 -->
    <update id="updateByPrimaryKeySelective" parameterType="${E.value}.${l}">
        UPDATE ${e}
        <set>
${m}
        </set>
        WHERE ${c} = #{${T},jdbcType=${b}}
    </update>

    <!-- 批量根据主键选择性更新 -->
    <update id="updateBatchByPrimaryKeySelective" parameterType="java.util.List">
        <foreach collection="list" item="item" separator=";">
            UPDATE ${e}
            <set>
${L}
            </set>
            WHERE ${c} = #{item.${T},jdbcType=${b}}
        </foreach>
    </update>

    <!-- 根据主键查询 -->
    <select id="selectByPrimaryKey" resultMap="BaseResultMap">
        SELECT
        <include refid="Base_Column_List" />
        FROM ${e}
        WHERE ${c} = #{id,jdbcType=${b}}
    </select>

    <!-- 根据条件查询数量 -->
    <select id="selectCountByMap" parameterType="java.util.Map" resultType="int">
        SELECT COUNT(*)
        FROM ${e}
        <include refid="Base_Where_Clause" />
    </select>

    <!-- 根据条件查询单条 -->
    <select id="selectByMap" parameterType="java.util.Map" resultMap="BaseResultMap">
        SELECT
        <include refid="Base_Column_List" />
        FROM ${e}
        <include refid="Base_Where_Clause" />
        LIMIT 1
    </select>

    <!-- 根据条件查询列表 -->
    <select id="selectListByMap" parameterType="java.util.Map" resultMap="BaseResultMap">
        SELECT
        <include refid="Base_Column_List" />
        FROM ${e}
        <include refid="Base_Where_Clause" />
    </select>

</mapper>
`}),Y=()=>{if(!g.value){N.warning("请先解析建表 SQL");return}S(g.value)},q=()=>{if(!I.value){N.warning("请先解析建表 SQL");return}S(I.value)},G=()=>{if(!R.value){N.warning("请先解析建表 SQL");return}S(R.value)},H=()=>{M.value="",u.value=null},Q=()=>{M.value="CREATE TABLE `sys_user` (\n  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',\n  `username` varchar(50) NOT NULL COMMENT '用户名',\n  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',\n  `phone_number` varchar(20) DEFAULT NULL COMMENT '手机号',\n  `balance` decimal(10,2) DEFAULT '0.00' COMMENT '余额',\n  `status` tinyint DEFAULT '1' COMMENT '状态 1:启用 0:禁用',\n  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',\n  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `uk_username` (`username`),\n  KEY `idx_status` (`status`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户信息表';"};return(l,e)=>{const i=Z,r=J,c=ee,T=ae,b=te,p=le,d=ie,_=se,v=oe,y=re,f=ne;return x(),w("div",pe,[e[19]||(e[19]=t("div",{class:"mb-6"},[t("h1",{class:"text-2xl font-bold text-gray-900 dark:text-white mb-2"},"MyBatis 代码生成"),t("p",{class:"text-gray-500"},"根据建表 SQL 生成实体类、Mapper 接口和 XML 配置文件")],-1)),t("div",ue,[s(c,null,{header:n(()=>[t("div",de,[e[6]||(e[6]=t("span",null,"建表 SQL 输入",-1)),t("div",ye,[s(i,{size:"small",onClick:Q,text:""},{default:n(()=>[...e[4]||(e[4]=[o("示例",-1)])]),_:1}),s(i,{size:"small",onClick:H},{default:n(()=>[...e[5]||(e[5]=[o("清空",-1)])]),_:1})])])]),default:n(()=>[t("div",Te,[t("div",null,[e[7]||(e[7]=t("label",{class:"block text-sm mb-2"},"实体类包名",-1)),s(r,{modelValue:E.value,"onUpdate:modelValue":e[0]||(e[0]=m=>E.value=m),placeholder:"com.example.entity"},null,8,["modelValue"])]),t("div",null,[e[8]||(e[8]=t("label",{class:"block text-sm mb-2"},"Mapper 包名",-1)),s(r,{modelValue:C.value,"onUpdate:modelValue":e[1]||(e[1]=m=>C.value=m),placeholder:"com.example.mapper"},null,8,["modelValue"])])]),t("div",be,[e[9]||(e[9]=t("label",{class:"block text-sm mb-2"},"建表 SQL",-1)),s(r,{modelValue:M.value,"onUpdate:modelValue":e[2]||(e[2]=m=>M.value=m),type:"textarea",rows:18,placeholder:"请粘贴 CREATE TABLE SQL 语句...",class:"font-mono text-sm"},null,8,["modelValue"])]),s(i,{type:"primary",onClick:F,class:"w-full"},{default:n(()=>[...e[10]||(e[10]=[o(" 解析并生成 ",-1)])]),_:1})]),_:1}),s(c,null,{header:n(()=>[...e[11]||(e[11]=[t("div",{class:"flex items-center justify-between"},[t("span",null,"生成结果")],-1)])]),default:n(()=>[s(b,{modelValue:h.value,"onUpdate:modelValue":e[3]||(e[3]=m=>h.value=m)},{default:n(()=>[s(T,{label:"实体类",name:"entity"},{default:n(()=>[t("div",ve,[s(i,{size:"small",onClick:Y},{default:n(()=>[...e[12]||(e[12]=[o("复制代码",-1)])]),_:1})]),s(r,{"model-value":g.value,type:"textarea",rows:20,readonly:"",placeholder:"实体类代码将在这里显示...",class:"font-mono text-sm"},null,8,["model-value"])]),_:1}),s(T,{label:"Mapper 接口",name:"mapper"},{default:n(()=>[t("div",Ee,[s(i,{size:"small",onClick:q},{default:n(()=>[...e[13]||(e[13]=[o("复制代码",-1)])]),_:1})]),s(r,{"model-value":I.value,type:"textarea",rows:20,readonly:"",placeholder:"Mapper 接口代码将在这里显示...",class:"font-mono text-sm"},null,8,["model-value"])]),_:1}),s(T,{label:"XML 配置",name:"xml"},{default:n(()=>[t("div",fe,[s(i,{size:"small",onClick:G},{default:n(()=>[...e[14]||(e[14]=[o("复制代码",-1)])]),_:1})]),s(r,{"model-value":R.value,type:"textarea",rows:20,readonly:"",placeholder:"XML 配置将在这里显示...",class:"font-mono text-sm"},null,8,["model-value"])]),_:1})]),_:1},8,["modelValue"]),u.value?(x(),w("div",Me,[s(p,{"content-position":"left"},{default:n(()=>[...e[15]||(e[15]=[o("解析结果",-1)])]),_:1}),s(_,{column:2,size:"small",border:""},{default:n(()=>[s(d,{label:"表名"},{default:n(()=>[o(B(u.value.tableName),1)]),_:1}),s(d,{label:"类名"},{default:n(()=>[o(B(u.value.className),1)]),_:1}),s(d,{label:"字段数"},{default:n(()=>[o(B(u.value.fields.length),1)]),_:1}),s(d,{label:"主键"},{default:n(()=>{var m;return[o(B(((m=u.value.fields.find(L=>L.isPrimaryKey))==null?void 0:m.column)||"未识别"),1)]}),_:1})]),_:1}),s(f,{data:u.value.fields,size:"small",class:"mt-4","max-height":"200"},{default:n(()=>[s(v,{prop:"column",label:"列名",width:"120"}),s(v,{prop:"javaName",label:"属性名",width:"120"}),s(v,{prop:"sqlType",label:"SQL类型",width:"120"}),s(v,{prop:"javaType",label:"Java类型",width:"100"}),s(v,{prop:"comment",label:"注释","min-width":"120","show-overflow-tooltip":""}),s(v,{label:"主键",width:"60",align:"center"},{default:n(({row:m})=>[m.isPrimaryKey?(x(),ce(y,{key:0,type:"success",size:"small"},{default:n(()=>[...e[16]||(e[16]=[o("是",-1)])]),_:1})):P("",!0)]),_:1})]),_:1},8,["data"])])):P("",!0)]),_:1})]),s(c,{class:"mt-4"},{header:n(()=>[...e[17]||(e[17]=[o("功能说明",-1)])]),default:n(()=>[e[18]||(e[18]=t("div",{class:"text-sm text-gray-600 dark:text-gray-400"},[t("p",{class:"mb-2"},"支持解析 MySQL CREATE TABLE 语句，自动提取："),t("ul",{class:"list-disc list-inside space-y-1 mb-4"},[t("li",null,"表名和表注释"),t("li",null,"字段名、类型、注释"),t("li",null,"主键信息"),t("li",null,"自动转换为 Java 驼峰命名")]),t("p",{class:"mb-2"},"生成的代码包含："),t("ul",{class:"list-disc list-inside space-y-1 mb-4"},[t("li",null,[t("strong",null,"实体类"),o(" - 使用 Lombok @Data 注解")]),t("li",null,[t("strong",null,"Mapper 接口"),o(" - 包含常用 CRUD 方法")]),t("li",null,[t("strong",null,"XML 配置"),o(" - 完整的 SQL 映射")])]),t("p",{class:"mb-2"},"Mapper 接口方法列表："),t("ul",{class:"list-disc list-inside space-y-1"},[t("li",null,[t("code",null,"insertSelective"),o(" - 选择性插入")]),t("li",null,[t("code",null,"insertBatchSelective"),o(" - 批量选择性插入")]),t("li",null,[t("code",null,"deleteByPrimaryKey"),o(" - 根据主键删除")]),t("li",null,[t("code",null,"updateByPrimaryKeySelective"),o(" - 根据主键选择性更新")]),t("li",null,[t("code",null,"updateBatchByPrimaryKeySelective"),o(" - 批量根据主键选择性更新")]),t("li",null,[t("code",null,"selectByPrimaryKey"),o(" - 根据主键查询")]),t("li",null,[t("code",null,"selectCountByMap"),o(" - 根据条件查询数量")]),t("li",null,[t("code",null,"selectByMap"),o(" - 根据条件查询单条")]),t("li",null,[t("code",null,"selectListByMap"),o(" - 根据条件查询列表")])])],-1))]),_:1})])}}}),Pe=X(Le,[["__scopeId","data-v-4c1ee1a3"]]);export{Pe as default};
