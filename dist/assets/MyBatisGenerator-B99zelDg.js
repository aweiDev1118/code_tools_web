import{u as Z,_ as ee}from"./index-D_4lSYXG.js";/* empty css                        *//* empty css                    */import"./el-tooltip-l0sNRNKZ.js";/* empty css                  *//* empty css                     *//* empty css               *//* empty css                   *//* empty css                    *//* empty css                *//* empty css                 *//* empty css                  */import{c as A}from"./clipboard-dJx9pk-X.js";import{af as te,ac as ae,ag as le,au as oe,av as se,ao as ie,aw as ne,ax as re,ay as me,az as ce,ak as C,aj as pe}from"./element-plus-BMPf8qgq.js";import{v as ue,r as $,c as P,B as U,D as a,O as n,L as s,u as t,F as m,K as c,I as k,y as de,z as S}from"./vue-vendor-hRmw8XWz.js";const ye={class:"max-w-7xl mx-auto"},be={class:"mb-6"},ge={class:"text-2xl font-bold text-gray-900 dark:text-white mb-2"},Te={class:"text-gray-500"},ve={class:"grid grid-cols-1 lg:grid-cols-2 gap-4"},_e={class:"flex items-center justify-between"},fe={class:"flex gap-2"},Ee={class:"grid grid-cols-2 gap-4 mb-4"},he={class:"block text-sm mb-2"},Me={class:"block text-sm mb-2"},Ne={class:"mb-4"},Ce={class:"block text-sm mb-2"},$e={class:"flex items-center justify-between"},je={class:"mb-2 flex justify-end"},Le={class:"mb-2 flex justify-end"},Be={class:"mb-2 flex justify-end"},Ie={key:0,class:"mt-4"},xe={class:"text-sm text-gray-600 dark:text-gray-400"},Re={class:"mb-2"},Ae={class:"list-disc list-inside space-y-1 mb-4"},Pe={class:"mb-2"},Se={class:"list-disc list-inside space-y-1 mb-4"},Oe={class:"mb-2"},De={class:"list-disc list-inside space-y-1"},we=ue({__name:"MyBatisGenerator",setup(Ue){const{t:e}=Z(),M=$(""),E=$("com.example.entity"),j=$("com.example.mapper"),O=$("entity"),b=$(null),V={bigint:"Long",int:"Integer",integer:"Integer",tinyint:"Integer",smallint:"Integer",mediumint:"Integer",float:"Float",double:"Double",decimal:"BigDecimal",numeric:"BigDecimal",bit:"Boolean",boolean:"Boolean",char:"String",varchar:"String",text:"String",tinytext:"String",mediumtext:"String",longtext:"String",json:"String",date:"LocalDate",time:"LocalTime",datetime:"LocalDateTime",timestamp:"LocalDateTime",year:"Integer",blob:"byte[]",tinyblob:"byte[]",mediumblob:"byte[]",longblob:"byte[]",binary:"byte[]",varbinary:"byte[]"},F={bigint:"BIGINT",int:"INTEGER",integer:"INTEGER",tinyint:"TINYINT",smallint:"SMALLINT",mediumint:"INTEGER",float:"FLOAT",double:"DOUBLE",decimal:"DECIMAL",numeric:"NUMERIC",bit:"BIT",boolean:"BOOLEAN",char:"CHAR",varchar:"VARCHAR",text:"LONGVARCHAR",tinytext:"VARCHAR",mediumtext:"LONGVARCHAR",longtext:"LONGVARCHAR",json:"VARCHAR",date:"DATE",time:"TIME",datetime:"TIMESTAMP",timestamp:"TIMESTAMP",year:"INTEGER",blob:"BLOB",tinyblob:"BLOB",mediumblob:"BLOB",longblob:"BLOB",binary:"BINARY",varbinary:"VARBINARY"},D=i=>i.toLowerCase().replace(/_([a-z])/g,(l,r)=>r.toUpperCase()),K=i=>{const l=D(i);return l.charAt(0).toUpperCase()+l.slice(1)},q=i=>{const l=i.match(/^(\w+)/);return l?l[1].toLowerCase():"varchar"},G=()=>{if(!M.value.trim()){C.warning(e("tool.mybatis-generator.inputRequired"));return}try{const i=M.value,l=i.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?(\w+)[`"]?/i);if(!l)throw new Error(e("tool.mybatis-generator.cannotParseTableName"));const r=l[1],p=i.match(/COMMENT\s*=?\s*'([^']+)'\s*;?\s*$/i),d=p?p[1]:"",v=i.match(/PRIMARY\s+KEY\s*\(\s*[`"]?(\w+)[`"]?/i),_=v?v[1].toLowerCase():"",y=[],g=i.match(/\(([\s\S]+)\)/);if(!g)throw new Error(e("tool.mybatis-generator.cannotParseTableDef"));const f=g[1].split(",").map(T=>T.trim()).filter(T=>T);for(const T of f){if(/^\s*(PRIMARY|UNIQUE|KEY|INDEX|FOREIGN|CONSTRAINT)/i.test(T))continue;const h=T.match(/^[`"]?(\w+)[`"]?\s+([\w().,]+)/i);if(!h)continue;const u=h[1],N=h[2],B=q(N),o=T.match(/COMMENT\s+'([^']*)'/i),w=o?o[1]:"",X=!/NOT\s+NULL/i.test(T),Q=u.toLowerCase()===_||/PRIMARY\s+KEY/i.test(T);y.push({column:u,javaName:D(u),sqlType:N.toUpperCase(),javaType:V[B]||"String",jdbcType:F[B]||"VARCHAR",comment:w,isPrimaryKey:Q,nullable:X})}if(y.length===0)throw new Error(e("tool.mybatis-generator.noFieldsFound"));b.value={tableName:r,className:K(r),comment:d,fields:y},C.success(e("tool.mybatis-generator.parseSuccess"))}catch(i){C.error(e("tool.mybatis-generator.parseFailed")+": "+i.message)}},I=P(()=>{if(!b.value)return"";const{className:i,tableName:l,comment:r,fields:p}=b.value,d=new Set;d.add("import lombok.Data;");for(const y of p)y.javaType==="BigDecimal"?d.add("import java.math.BigDecimal;"):y.javaType==="LocalDateTime"?d.add("import java.time.LocalDateTime;"):y.javaType==="LocalDate"?d.add("import java.time.LocalDate;"):y.javaType==="LocalTime"&&d.add("import java.time.LocalTime;");const v=p.map(y=>{const g=[];return y.comment&&(g.push("    /**"),g.push(`     * ${y.comment}`),g.push("     */")),g.push(`    private ${y.javaType} ${y.javaName};`),g.join(`
`)}).join(`

`),_=Array.from(d).sort();return`package ${E.value};

${_.join(`
`)}

/**
 * ${r||i}
 * 表名: ${l}
 */
@Data
public class ${i} {

${v}
}
`}),x=P(()=>{if(!b.value)return"";const{className:i}=b.value,l=b.value.fields.find(p=>p.isPrimaryKey),r=(l==null?void 0:l.javaType)||"Long";return`package ${j.value};

import ${E.value}.${i};
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * ${i} Mapper 接口
 */
@Mapper
public interface ${i}Mapper {

    /**
     * 选择性插入
     */
    int insertSelective(${i} record);

    /**
     * 批量选择性插入
     */
    int insertBatchSelective(@Param("list") List<${i}> list);

    /**
     * 根据主键删除
     */
    int deleteByPrimaryKey(${r} id);

    /**
     * 根据主键选择性更新
     */
    int updateByPrimaryKeySelective(${i} record);

    /**
     * 批量根据主键选择性更新
     */
    int updateBatchByPrimaryKeySelective(@Param("list") List<${i}> list);

    /**
     * 根据主键查询
     */
    ${i} selectByPrimaryKey(${r} id);

    /**
     * 根据条件查询数量
     */
    int selectCountByMap(Map<String, Object> map);

    /**
     * 根据条件查询单条
     */
    ${i} selectByMap(Map<String, Object> map);

    /**
     * 根据条件查询列表
     */
    List<${i}> selectListByMap(Map<String, Object> map);
}
`}),R=P(()=>{if(!b.value)return"";const{className:i,tableName:l,fields:r}=b.value,p=r.find(o=>o.isPrimaryKey),d=(p==null?void 0:p.column)||"id",v=(p==null?void 0:p.javaName)||"id",_=(p==null?void 0:p.jdbcType)||"BIGINT",y=r.map(o=>o.column).join(", "),g=r.map(o=>`        <${o.isPrimaryKey?"id":"result"} column="${o.column}" property="${o.javaName}" jdbcType="${o.jdbcType}" />`).join(`
`),L=r.map(o=>`            <if test="${o.javaName} != null">${o.column},</if>`).join(`
`),f=r.map(o=>`            <if test="${o.javaName} != null">#{${o.javaName},jdbcType=${o.jdbcType}},</if>`).join(`
`),T=r.map(o=>o.column).join(", "),h=r.map(o=>`#{item.${o.javaName},jdbcType=${o.jdbcType}}`).join(", "),u=r.filter(o=>!o.isPrimaryKey).map(o=>`            <if test="${o.javaName} != null">${o.column} = #{${o.javaName},jdbcType=${o.jdbcType}},</if>`).join(`
`),N=r.filter(o=>!o.isPrimaryKey).map(o=>`                    <if test="item.${o.javaName} != null">${o.column} = #{item.${o.javaName},jdbcType=${o.jdbcType}},</if>`).join(`
`),B=r.map(o=>`            <if test="${o.javaName} != null">AND ${o.column} = #{${o.javaName},jdbcType=${o.jdbcType}}</if>`).join(`
`);return`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="${j.value}.${i}Mapper">

    <!-- 结果映射 -->
    <resultMap id="BaseResultMap" type="${E.value}.${i}">
${g}
    </resultMap>

    <!-- 基础列 -->
    <sql id="Base_Column_List">
        ${y}
    </sql>

    <!-- 查询条件 -->
    <sql id="Base_Where_Clause">
        <where>
${B}
        </where>
    </sql>

    <!-- 选择性插入 -->
    <insert id="insertSelective" parameterType="${E.value}.${i}">
        INSERT INTO ${l}
        <trim prefix="(" suffix=")" suffixOverrides=",">
${L}
        </trim>
        <trim prefix="VALUES (" suffix=")" suffixOverrides=",">
${f}
        </trim>
    </insert>

    <!-- 批量选择性插入 -->
    <insert id="insertBatchSelective" parameterType="java.util.List">
        INSERT INTO ${l} (${T})
        VALUES
        <foreach collection="list" item="item" separator=",">
            (${h})
        </foreach>
    </insert>

    <!-- 根据主键删除 -->
    <delete id="deleteByPrimaryKey">
        DELETE FROM ${l}
        WHERE ${d} = #{id,jdbcType=${_}}
    </delete>

    <!-- 根据主键选择性更新 -->
    <update id="updateByPrimaryKeySelective" parameterType="${E.value}.${i}">
        UPDATE ${l}
        <set>
${u}
        </set>
        WHERE ${d} = #{${v},jdbcType=${_}}
    </update>

    <!-- 批量根据主键选择性更新 -->
    <update id="updateBatchByPrimaryKeySelective" parameterType="java.util.List">
        <foreach collection="list" item="item" separator=";">
            UPDATE ${l}
            <set>
${N}
            </set>
            WHERE ${d} = #{item.${v},jdbcType=${_}}
        </foreach>
    </update>

    <!-- 根据主键查询 -->
    <select id="selectByPrimaryKey" resultMap="BaseResultMap">
        SELECT
        <include refid="Base_Column_List" />
        FROM ${l}
        WHERE ${d} = #{id,jdbcType=${_}}
    </select>

    <!-- 根据条件查询数量 -->
    <select id="selectCountByMap" parameterType="java.util.Map" resultType="int">
        SELECT COUNT(*)
        FROM ${l}
        <include refid="Base_Where_Clause" />
    </select>

    <!-- 根据条件查询单条 -->
    <select id="selectByMap" parameterType="java.util.Map" resultMap="BaseResultMap">
        SELECT
        <include refid="Base_Column_List" />
        FROM ${l}
        <include refid="Base_Where_Clause" />
        LIMIT 1
    </select>

    <!-- 根据条件查询列表 -->
    <select id="selectListByMap" parameterType="java.util.Map" resultMap="BaseResultMap">
        SELECT
        <include refid="Base_Column_List" />
        FROM ${l}
        <include refid="Base_Where_Clause" />
    </select>

</mapper>
`}),H=()=>{if(!I.value){C.warning(e("tool.mybatis-generator.parseFirst"));return}A(I.value)},Y=()=>{if(!x.value){C.warning(e("tool.mybatis-generator.parseFirst"));return}A(x.value)},z=()=>{if(!R.value){C.warning(e("tool.mybatis-generator.parseFirst"));return}A(R.value)},W=()=>{M.value="",b.value=null},J=()=>{M.value="CREATE TABLE `sys_user` (\n  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',\n  `username` varchar(50) NOT NULL COMMENT '用户名',\n  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',\n  `phone_number` varchar(20) DEFAULT NULL COMMENT '手机号',\n  `balance` decimal(10,2) DEFAULT '0.00' COMMENT '余额',\n  `status` tinyint DEFAULT '1' COMMENT '状态 1:启用 0:禁用',\n  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',\n  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `uk_username` (`username`),\n  KEY `idx_status` (`status`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户信息表';"};return(i,l)=>{const r=ae,p=te,d=le,v=se,_=oe,y=ie,g=re,L=ne,f=ce,T=pe,h=me;return S(),U("div",ye,[a("div",be,[a("h1",ge,s(t(e)("tool.mybatis-generator.name")),1),a("p",Te,s(t(e)("tool.mybatis-generator.subtitle")),1)]),a("div",ve,[n(d,null,{header:m(()=>[a("div",_e,[a("span",null,s(t(e)("tool.mybatis-generator.sqlInputHeader")),1),a("div",fe,[n(r,{size:"small",onClick:J,text:""},{default:m(()=>[c(s(t(e)("tool.mybatis-generator.sample")),1)]),_:1}),n(r,{size:"small",onClick:W},{default:m(()=>[c(s(t(e)("common.clear")),1)]),_:1})])])]),default:m(()=>[a("div",Ee,[a("div",null,[a("label",he,s(t(e)("tool.mybatis-generator.entityPackage")),1),n(p,{modelValue:E.value,"onUpdate:modelValue":l[0]||(l[0]=u=>E.value=u),placeholder:"com.example.entity"},null,8,["modelValue"])]),a("div",null,[a("label",Me,s(t(e)("tool.mybatis-generator.mapperPackage")),1),n(p,{modelValue:j.value,"onUpdate:modelValue":l[1]||(l[1]=u=>j.value=u),placeholder:"com.example.mapper"},null,8,["modelValue"])])]),a("div",Ne,[a("label",Ce,s(t(e)("tool.mybatis-generator.sqlLabel")),1),n(p,{modelValue:M.value,"onUpdate:modelValue":l[2]||(l[2]=u=>M.value=u),type:"textarea",rows:18,placeholder:t(e)("tool.mybatis-generator.sqlPlaceholder"),class:"font-mono text-sm"},null,8,["modelValue","placeholder"])]),n(r,{type:"primary",onClick:G,class:"w-full"},{default:m(()=>[c(s(t(e)("tool.mybatis-generator.parseAndGenerate")),1)]),_:1})]),_:1}),n(d,null,{header:m(()=>[a("div",$e,[a("span",null,s(t(e)("tool.mybatis-generator.generatedResult")),1)])]),default:m(()=>[n(_,{modelValue:O.value,"onUpdate:modelValue":l[3]||(l[3]=u=>O.value=u)},{default:m(()=>[n(v,{label:t(e)("tool.mybatis-generator.entityTab"),name:"entity"},{default:m(()=>[a("div",je,[n(r,{size:"small",onClick:H},{default:m(()=>[c(s(t(e)("tool.mybatis-generator.copyCode")),1)]),_:1})]),n(p,{"model-value":I.value,type:"textarea",rows:20,readonly:"",placeholder:t(e)("tool.mybatis-generator.entityPlaceholder"),class:"font-mono text-sm"},null,8,["model-value","placeholder"])]),_:1},8,["label"]),n(v,{label:t(e)("tool.mybatis-generator.mapperTab"),name:"mapper"},{default:m(()=>[a("div",Le,[n(r,{size:"small",onClick:Y},{default:m(()=>[c(s(t(e)("tool.mybatis-generator.copyCode")),1)]),_:1})]),n(p,{"model-value":x.value,type:"textarea",rows:20,readonly:"",placeholder:t(e)("tool.mybatis-generator.mapperPlaceholder"),class:"font-mono text-sm"},null,8,["model-value","placeholder"])]),_:1},8,["label"]),n(v,{label:t(e)("tool.mybatis-generator.xmlTab"),name:"xml"},{default:m(()=>[a("div",Be,[n(r,{size:"small",onClick:z},{default:m(()=>[c(s(t(e)("tool.mybatis-generator.copyCode")),1)]),_:1})]),n(p,{"model-value":R.value,type:"textarea",rows:20,readonly:"",placeholder:t(e)("tool.mybatis-generator.xmlPlaceholder"),class:"font-mono text-sm"},null,8,["model-value","placeholder"])]),_:1},8,["label"])]),_:1},8,["modelValue"]),b.value?(S(),U("div",Ie,[n(y,{"content-position":"left"},{default:m(()=>[c(s(t(e)("tool.mybatis-generator.parseResult")),1)]),_:1}),n(L,{column:2,size:"small",border:""},{default:m(()=>[n(g,{label:t(e)("tool.mybatis-generator.tableName")},{default:m(()=>[c(s(b.value.tableName),1)]),_:1},8,["label"]),n(g,{label:t(e)("tool.mybatis-generator.className")},{default:m(()=>[c(s(b.value.className),1)]),_:1},8,["label"]),n(g,{label:t(e)("tool.mybatis-generator.fieldCount")},{default:m(()=>[c(s(b.value.fields.length),1)]),_:1},8,["label"]),n(g,{label:t(e)("tool.mybatis-generator.primaryKey")},{default:m(()=>{var u;return[c(s(((u=b.value.fields.find(N=>N.isPrimaryKey))==null?void 0:u.column)||t(e)("tool.mybatis-generator.unrecognized")),1)]}),_:1},8,["label"])]),_:1}),n(h,{data:b.value.fields,size:"small",class:"mt-4","max-height":"200"},{default:m(()=>[n(f,{prop:"column",label:t(e)("tool.mybatis-generator.colColumn"),width:"120"},null,8,["label"]),n(f,{prop:"javaName",label:t(e)("tool.mybatis-generator.colJavaName"),width:"120"},null,8,["label"]),n(f,{prop:"sqlType",label:t(e)("tool.mybatis-generator.colSqlType"),width:"120"},null,8,["label"]),n(f,{prop:"javaType",label:t(e)("tool.mybatis-generator.colJavaType"),width:"100"},null,8,["label"]),n(f,{prop:"comment",label:t(e)("tool.mybatis-generator.colComment"),"min-width":"120","show-overflow-tooltip":""},null,8,["label"]),n(f,{label:t(e)("tool.mybatis-generator.colPrimaryKey"),width:"60",align:"center"},{default:m(({row:u})=>[u.isPrimaryKey?(S(),de(T,{key:0,type:"success",size:"small"},{default:m(()=>[c(s(t(e)("tool.mybatis-generator.yes")),1)]),_:1})):k("",!0)]),_:1},8,["label"])]),_:1},8,["data"])])):k("",!0)]),_:1})]),n(d,{class:"mt-4"},{header:m(()=>[c(s(t(e)("tool.mybatis-generator.featureDesc")),1)]),default:m(()=>[a("div",xe,[a("p",Re,s(t(e)("tool.mybatis-generator.supportsParsing")),1),a("ul",Ae,[a("li",null,s(t(e)("tool.mybatis-generator.feat1")),1),a("li",null,s(t(e)("tool.mybatis-generator.feat2")),1),a("li",null,s(t(e)("tool.mybatis-generator.feat3")),1),a("li",null,s(t(e)("tool.mybatis-generator.feat4")),1)]),a("p",Pe,s(t(e)("tool.mybatis-generator.generatedIncludes")),1),a("ul",Se,[a("li",null,[a("strong",null,s(t(e)("tool.mybatis-generator.entityClass")),1),c(" - "+s(t(e)("tool.mybatis-generator.entityClassDesc")),1)]),a("li",null,[a("strong",null,s(t(e)("tool.mybatis-generator.mapperInterface")),1),c(" - "+s(t(e)("tool.mybatis-generator.mapperInterfaceDesc")),1)]),a("li",null,[a("strong",null,s(t(e)("tool.mybatis-generator.xmlConfig")),1),c(" - "+s(t(e)("tool.mybatis-generator.xmlConfigDesc")),1)])]),a("p",Oe,s(t(e)("tool.mybatis-generator.mapperMethods")),1),a("ul",De,[a("li",null,[l[4]||(l[4]=a("code",null,"insertSelective",-1)),c(" - "+s(t(e)("tool.mybatis-generator.method1")),1)]),a("li",null,[l[5]||(l[5]=a("code",null,"insertBatchSelective",-1)),c(" - "+s(t(e)("tool.mybatis-generator.method2")),1)]),a("li",null,[l[6]||(l[6]=a("code",null,"deleteByPrimaryKey",-1)),c(" - "+s(t(e)("tool.mybatis-generator.method3")),1)]),a("li",null,[l[7]||(l[7]=a("code",null,"updateByPrimaryKeySelective",-1)),c(" - "+s(t(e)("tool.mybatis-generator.method4")),1)]),a("li",null,[l[8]||(l[8]=a("code",null,"updateBatchByPrimaryKeySelective",-1)),c(" - "+s(t(e)("tool.mybatis-generator.method5")),1)]),a("li",null,[l[9]||(l[9]=a("code",null,"selectByPrimaryKey",-1)),c(" - "+s(t(e)("tool.mybatis-generator.method6")),1)]),a("li",null,[l[10]||(l[10]=a("code",null,"selectCountByMap",-1)),c(" - "+s(t(e)("tool.mybatis-generator.method7")),1)]),a("li",null,[l[11]||(l[11]=a("code",null,"selectByMap",-1)),c(" - "+s(t(e)("tool.mybatis-generator.method8")),1)]),a("li",null,[l[12]||(l[12]=a("code",null,"selectListByMap",-1)),c(" - "+s(t(e)("tool.mybatis-generator.method9")),1)])])])]),_:1})])}}}),tt=ee(we,[["__scopeId","data-v-ab7138ff"]]);export{tt as default};
