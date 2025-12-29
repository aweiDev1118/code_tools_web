<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { copyToClipboard } from '@/utils/clipboard'

interface Field {
  column: string
  javaName: string
  sqlType: string
  javaType: string
  jdbcType: string
  comment: string
  isPrimaryKey: boolean
  nullable: boolean
}

interface TableInfo {
  tableName: string
  className: string
  comment: string
  fields: Field[]
}

const sqlInput = ref('')
const entityPackage = ref('com.example.entity')
const mapperPackage = ref('com.example.mapper')
const activeTab = ref('entity')

const tableInfo = ref<TableInfo | null>(null)

// MySQL 类型到 Java 类型映射
const sqlToJavaType: Record<string, string> = {
  'bigint': 'Long',
  'int': 'Integer',
  'integer': 'Integer',
  'tinyint': 'Integer',
  'smallint': 'Integer',
  'mediumint': 'Integer',
  'float': 'Float',
  'double': 'Double',
  'decimal': 'BigDecimal',
  'numeric': 'BigDecimal',
  'bit': 'Boolean',
  'boolean': 'Boolean',
  'char': 'String',
  'varchar': 'String',
  'text': 'String',
  'tinytext': 'String',
  'mediumtext': 'String',
  'longtext': 'String',
  'json': 'String',
  'date': 'LocalDate',
  'time': 'LocalTime',
  'datetime': 'LocalDateTime',
  'timestamp': 'LocalDateTime',
  'year': 'Integer',
  'blob': 'byte[]',
  'tinyblob': 'byte[]',
  'mediumblob': 'byte[]',
  'longblob': 'byte[]',
  'binary': 'byte[]',
  'varbinary': 'byte[]',
}

// MySQL 类型到 JDBC 类型映射
const sqlToJdbcType: Record<string, string> = {
  'bigint': 'BIGINT',
  'int': 'INTEGER',
  'integer': 'INTEGER',
  'tinyint': 'TINYINT',
  'smallint': 'SMALLINT',
  'mediumint': 'INTEGER',
  'float': 'FLOAT',
  'double': 'DOUBLE',
  'decimal': 'DECIMAL',
  'numeric': 'NUMERIC',
  'bit': 'BIT',
  'boolean': 'BOOLEAN',
  'char': 'CHAR',
  'varchar': 'VARCHAR',
  'text': 'LONGVARCHAR',
  'tinytext': 'VARCHAR',
  'mediumtext': 'LONGVARCHAR',
  'longtext': 'LONGVARCHAR',
  'json': 'VARCHAR',
  'date': 'DATE',
  'time': 'TIME',
  'datetime': 'TIMESTAMP',
  'timestamp': 'TIMESTAMP',
  'year': 'INTEGER',
  'blob': 'BLOB',
  'tinyblob': 'BLOB',
  'mediumblob': 'BLOB',
  'longblob': 'BLOB',
  'binary': 'BINARY',
  'varbinary': 'VARBINARY',
}

// 下划线转驼峰
const toCamelCase = (str: string): string => {
  return str.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

// 下划线转帕斯卡（首字母大写驼峰）
const toPascalCase = (str: string): string => {
  const camel = toCamelCase(str)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}

// 解析 SQL 类型，提取基础类型
const parseSqlType = (typeStr: string): string => {
  const match = typeStr.match(/^(\w+)/)
  return match ? match[1].toLowerCase() : 'varchar'
}

// 解析建表 SQL
const parseSql = () => {
  if (!sqlInput.value.trim()) {
    ElMessage.warning('请输入建表 SQL')
    return
  }

  try {
    const sql = sqlInput.value

    // 提取表名
    const tableNameMatch = sql.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?(\w+)[`"]?/i)
    if (!tableNameMatch) {
      throw new Error('无法解析表名')
    }
    const tableName = tableNameMatch[1]

    // 提取表注释
    const tableCommentMatch = sql.match(/COMMENT\s*=?\s*'([^']+)'\s*;?\s*$/i)
    const tableComment = tableCommentMatch ? tableCommentMatch[1] : ''

    // 提取主键
    const primaryKeyMatch = sql.match(/PRIMARY\s+KEY\s*\(\s*[`"]?(\w+)[`"]?/i)
    const primaryKeyColumn = primaryKeyMatch ? primaryKeyMatch[1].toLowerCase() : ''

    // 提取字段定义
    const fields: Field[] = []

    // 获取括号内的内容
    const innerMatch = sql.match(/\(([\s\S]+)\)/);
    if (!innerMatch) {
      throw new Error('无法解析表定义')
    }

    const innerContent = innerMatch[1]
    const lines = innerContent.split(',').map(line => line.trim()).filter(line => line)

    for (const line of lines) {
      // 跳过约束定义
      if (/^\s*(PRIMARY|UNIQUE|KEY|INDEX|FOREIGN|CONSTRAINT)/i.test(line)) {
        continue
      }

      // 解析字段
      const fieldMatch = line.match(/^[`"]?(\w+)[`"]?\s+([\w().,]+)/i)
      if (!fieldMatch) continue

      const column = fieldMatch[1]
      const sqlType = fieldMatch[2]
      const baseType = parseSqlType(sqlType)

      // 提取注释
      const commentMatch = line.match(/COMMENT\s+'([^']*)'/i)
      const comment = commentMatch ? commentMatch[1] : ''

      // 检查是否允许 NULL
      const nullable = !/NOT\s+NULL/i.test(line)

      // 检查是否是主键
      const isPrimaryKey = column.toLowerCase() === primaryKeyColumn ||
                          /PRIMARY\s+KEY/i.test(line)

      fields.push({
        column,
        javaName: toCamelCase(column),
        sqlType: sqlType.toUpperCase(),
        javaType: sqlToJavaType[baseType] || 'String',
        jdbcType: sqlToJdbcType[baseType] || 'VARCHAR',
        comment,
        isPrimaryKey,
        nullable
      })
    }

    if (fields.length === 0) {
      throw new Error('未找到字段定义')
    }

    tableInfo.value = {
      tableName,
      className: toPascalCase(tableName),
      comment: tableComment,
      fields
    }

    ElMessage.success('解析成功')
  } catch (e) {
    ElMessage.error('解析失败: ' + (e as Error).message)
  }
}

// 生成实体类
const entityOutput = computed(() => {
  if (!tableInfo.value) return ''

  const { className, tableName, comment, fields } = tableInfo.value

  // 收集需要导入的类
  const imports = new Set<string>()
  imports.add('import lombok.Data;')

  for (const field of fields) {
    if (field.javaType === 'BigDecimal') {
      imports.add('import java.math.BigDecimal;')
    } else if (field.javaType === 'LocalDateTime') {
      imports.add('import java.time.LocalDateTime;')
    } else if (field.javaType === 'LocalDate') {
      imports.add('import java.time.LocalDate;')
    } else if (field.javaType === 'LocalTime') {
      imports.add('import java.time.LocalTime;')
    }
  }

  // 生成字段定义
  const fieldDefs = fields.map(f => {
    const lines: string[] = []
    if (f.comment) {
      lines.push(`    /**`)
      lines.push(`     * ${f.comment}`)
      lines.push(`     */`)
    }
    lines.push(`    private ${f.javaType} ${f.javaName};`)
    return lines.join('\n')
  }).join('\n\n')

  const sortedImports = Array.from(imports).sort()

  return `package ${entityPackage.value};

${sortedImports.join('\n')}

/**
 * ${comment || className}
 * 表名: ${tableName}
 */
@Data
public class ${className} {

${fieldDefs}
}
`
})

// 生成 Mapper 接口
const mapperOutput = computed(() => {
  if (!tableInfo.value) return ''

  const { className } = tableInfo.value
  const primaryKey = tableInfo.value.fields.find(f => f.isPrimaryKey)
  const pkType = primaryKey?.javaType || 'Long'

  return `package ${mapperPackage.value};

import ${entityPackage.value}.${className};
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * ${className} Mapper 接口
 */
@Mapper
public interface ${className}Mapper {

    /**
     * 选择性插入
     */
    int insertSelective(${className} record);

    /**
     * 批量选择性插入
     */
    int insertBatchSelective(@Param("list") List<${className}> list);

    /**
     * 根据主键删除
     */
    int deleteByPrimaryKey(${pkType} id);

    /**
     * 根据主键选择性更新
     */
    int updateByPrimaryKeySelective(${className} record);

    /**
     * 批量根据主键选择性更新
     */
    int updateBatchByPrimaryKeySelective(@Param("list") List<${className}> list);

    /**
     * 根据主键查询
     */
    ${className} selectByPrimaryKey(${pkType} id);

    /**
     * 根据条件查询数量
     */
    int selectCountByMap(Map<String, Object> map);

    /**
     * 根据条件查询单条
     */
    ${className} selectByMap(Map<String, Object> map);

    /**
     * 根据条件查询列表
     */
    List<${className}> selectListByMap(Map<String, Object> map);
}
`
})

// 生成 XML 文件
const xmlOutput = computed(() => {
  if (!tableInfo.value) return ''

  const { className, tableName, fields } = tableInfo.value
  const primaryKey = fields.find(f => f.isPrimaryKey)
  const pkColumn = primaryKey?.column || 'id'
  const pkField = primaryKey?.javaName || 'id'
  const pkJdbcType = primaryKey?.jdbcType || 'BIGINT'

  // 生成 Base_Column_List
  const columnList = fields.map(f => f.column).join(', ')

  // 生成 ResultMap
  const resultMapItems = fields.map(f => {
    const tag = f.isPrimaryKey ? 'id' : 'result'
    return `        <${tag} column="${f.column}" property="${f.javaName}" jdbcType="${f.jdbcType}" />`
  }).join('\n')

  // 生成 insertSelective 的字段
  const insertColumns = fields.map(f =>
    `            <if test="${f.javaName} != null">${f.column},</if>`
  ).join('\n')

  const insertValues = fields.map(f =>
    `            <if test="${f.javaName} != null">#{${f.javaName},jdbcType=${f.jdbcType}},</if>`
  ).join('\n')

  // 生成 insertBatchSelective
  const batchInsertColumns = fields.map(f => f.column).join(', ')
  const batchInsertValues = fields.map(f =>
    `#{item.${f.javaName},jdbcType=${f.jdbcType}}`
  ).join(', ')

  // 生成 updateByPrimaryKeySelective 的 set 语句
  const updateSetItems = fields
    .filter(f => !f.isPrimaryKey)
    .map(f => `            <if test="${f.javaName} != null">${f.column} = #{${f.javaName},jdbcType=${f.jdbcType}},</if>`)
    .join('\n')

  // 生成 updateBatchByPrimaryKeySelective
  const batchUpdateSetItems = fields
    .filter(f => !f.isPrimaryKey)
    .map(f => `                    <if test="item.${f.javaName} != null">${f.column} = #{item.${f.javaName},jdbcType=${f.jdbcType}},</if>`)
    .join('\n')

  // 生成 where 条件
  const whereConditions = fields.map(f =>
    `            <if test="${f.javaName} != null">AND ${f.column} = #{${f.javaName},jdbcType=${f.jdbcType}}</if>`
  ).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="${mapperPackage.value}.${className}Mapper">

    <!-- 结果映射 -->
    <resultMap id="BaseResultMap" type="${entityPackage.value}.${className}">
${resultMapItems}
    </resultMap>

    <!-- 基础列 -->
    <sql id="Base_Column_List">
        ${columnList}
    </sql>

    <!-- 查询条件 -->
    <sql id="Base_Where_Clause">
        <where>
${whereConditions}
        </where>
    </sql>

    <!-- 选择性插入 -->
    <insert id="insertSelective" parameterType="${entityPackage.value}.${className}">
        INSERT INTO ${tableName}
        <trim prefix="(" suffix=")" suffixOverrides=",">
${insertColumns}
        </trim>
        <trim prefix="VALUES (" suffix=")" suffixOverrides=",">
${insertValues}
        </trim>
    </insert>

    <!-- 批量选择性插入 -->
    <insert id="insertBatchSelective" parameterType="java.util.List">
        INSERT INTO ${tableName} (${batchInsertColumns})
        VALUES
        <foreach collection="list" item="item" separator=",">
            (${batchInsertValues})
        </foreach>
    </insert>

    <!-- 根据主键删除 -->
    <delete id="deleteByPrimaryKey">
        DELETE FROM ${tableName}
        WHERE ${pkColumn} = #{id,jdbcType=${pkJdbcType}}
    </delete>

    <!-- 根据主键选择性更新 -->
    <update id="updateByPrimaryKeySelective" parameterType="${entityPackage.value}.${className}">
        UPDATE ${tableName}
        <set>
${updateSetItems}
        </set>
        WHERE ${pkColumn} = #{${pkField},jdbcType=${pkJdbcType}}
    </update>

    <!-- 批量根据主键选择性更新 -->
    <update id="updateBatchByPrimaryKeySelective" parameterType="java.util.List">
        <foreach collection="list" item="item" separator=";">
            UPDATE ${tableName}
            <set>
${batchUpdateSetItems}
            </set>
            WHERE ${pkColumn} = #{item.${pkField},jdbcType=${pkJdbcType}}
        </foreach>
    </update>

    <!-- 根据主键查询 -->
    <select id="selectByPrimaryKey" resultMap="BaseResultMap">
        SELECT
        <include refid="Base_Column_List" />
        FROM ${tableName}
        WHERE ${pkColumn} = #{id,jdbcType=${pkJdbcType}}
    </select>

    <!-- 根据条件查询数量 -->
    <select id="selectCountByMap" parameterType="java.util.Map" resultType="int">
        SELECT COUNT(*)
        FROM ${tableName}
        <include refid="Base_Where_Clause" />
    </select>

    <!-- 根据条件查询单条 -->
    <select id="selectByMap" parameterType="java.util.Map" resultMap="BaseResultMap">
        SELECT
        <include refid="Base_Column_List" />
        FROM ${tableName}
        <include refid="Base_Where_Clause" />
        LIMIT 1
    </select>

    <!-- 根据条件查询列表 -->
    <select id="selectListByMap" parameterType="java.util.Map" resultMap="BaseResultMap">
        SELECT
        <include refid="Base_Column_List" />
        FROM ${tableName}
        <include refid="Base_Where_Clause" />
    </select>

</mapper>
`
})

const copyEntity = () => {
  if (!entityOutput.value) {
    ElMessage.warning('请先解析建表 SQL')
    return
  }
  copyToClipboard(entityOutput.value)
}

const copyMapper = () => {
  if (!mapperOutput.value) {
    ElMessage.warning('请先解析建表 SQL')
    return
  }
  copyToClipboard(mapperOutput.value)
}

const copyXml = () => {
  if (!xmlOutput.value) {
    ElMessage.warning('请先解析建表 SQL')
    return
  }
  copyToClipboard(xmlOutput.value)
}

const clear = () => {
  sqlInput.value = ''
  tableInfo.value = null
}

const loadSample = () => {
  sqlInput.value = `CREATE TABLE \`sys_user\` (
  \`id\` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  \`username\` varchar(50) NOT NULL COMMENT '用户名',
  \`email\` varchar(100) DEFAULT NULL COMMENT '邮箱',
  \`phone_number\` varchar(20) DEFAULT NULL COMMENT '手机号',
  \`balance\` decimal(10,2) DEFAULT '0.00' COMMENT '余额',
  \`status\` tinyint DEFAULT '1' COMMENT '状态 1:启用 0:禁用',
  \`create_time\` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  \`update_time\` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uk_username\` (\`username\`),
  KEY \`idx_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户信息表';`
}
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">MyBatis 代码生成</h1>
      <p class="text-gray-500">根据建表 SQL 生成实体类、Mapper 接口和 XML 配置文件</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- 左侧输入区 -->
      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <span>建表 SQL 输入</span>
            <div class="flex gap-2">
              <el-button size="small" @click="loadSample" text>示例</el-button>
              <el-button size="small" @click="clear">清空</el-button>
            </div>
          </div>
        </template>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm mb-2">实体类包名</label>
            <el-input v-model="entityPackage" placeholder="com.example.entity" />
          </div>
          <div>
            <label class="block text-sm mb-2">Mapper 包名</label>
            <el-input v-model="mapperPackage" placeholder="com.example.mapper" />
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm mb-2">建表 SQL</label>
          <el-input
            v-model="sqlInput"
            type="textarea"
            :rows="18"
            placeholder="请粘贴 CREATE TABLE SQL 语句..."
            class="font-mono text-sm"
          />
        </div>

        <el-button type="primary" @click="parseSql" class="w-full">
          解析并生成
        </el-button>
      </el-card>

      <!-- 右侧输出区 -->
      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <span>生成结果</span>
          </div>
        </template>

        <el-tabs v-model="activeTab">
          <el-tab-pane label="实体类" name="entity">
            <div class="mb-2 flex justify-end">
              <el-button size="small" @click="copyEntity">复制代码</el-button>
            </div>
            <el-input
              :model-value="entityOutput"
              type="textarea"
              :rows="20"
              readonly
              placeholder="实体类代码将在这里显示..."
              class="font-mono text-sm"
            />
          </el-tab-pane>

          <el-tab-pane label="Mapper 接口" name="mapper">
            <div class="mb-2 flex justify-end">
              <el-button size="small" @click="copyMapper">复制代码</el-button>
            </div>
            <el-input
              :model-value="mapperOutput"
              type="textarea"
              :rows="20"
              readonly
              placeholder="Mapper 接口代码将在这里显示..."
              class="font-mono text-sm"
            />
          </el-tab-pane>

          <el-tab-pane label="XML 配置" name="xml">
            <div class="mb-2 flex justify-end">
              <el-button size="small" @click="copyXml">复制代码</el-button>
            </div>
            <el-input
              :model-value="xmlOutput"
              type="textarea"
              :rows="20"
              readonly
              placeholder="XML 配置将在这里显示..."
              class="font-mono text-sm"
            />
          </el-tab-pane>
        </el-tabs>

        <!-- 解析结果预览 -->
        <div v-if="tableInfo" class="mt-4">
          <el-divider content-position="left">解析结果</el-divider>
          <el-descriptions :column="2" size="small" border>
            <el-descriptions-item label="表名">{{ tableInfo.tableName }}</el-descriptions-item>
            <el-descriptions-item label="类名">{{ tableInfo.className }}</el-descriptions-item>
            <el-descriptions-item label="字段数">{{ tableInfo.fields.length }}</el-descriptions-item>
            <el-descriptions-item label="主键">
              {{ tableInfo.fields.find(f => f.isPrimaryKey)?.column || '未识别' }}
            </el-descriptions-item>
          </el-descriptions>

          <el-table :data="tableInfo.fields" size="small" class="mt-4" max-height="200">
            <el-table-column prop="column" label="列名" width="120" />
            <el-table-column prop="javaName" label="属性名" width="120" />
            <el-table-column prop="sqlType" label="SQL类型" width="120" />
            <el-table-column prop="javaType" label="Java类型" width="100" />
            <el-table-column prop="comment" label="注释" min-width="120" show-overflow-tooltip />
            <el-table-column label="主键" width="60" align="center">
              <template #default="{ row }">
                <el-tag v-if="row.isPrimaryKey" type="success" size="small">是</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>

    <!-- 功能说明 -->
    <el-card class="mt-4">
      <template #header>功能说明</template>
      <div class="text-sm text-gray-600 dark:text-gray-400">
        <p class="mb-2">支持解析 MySQL CREATE TABLE 语句，自动提取：</p>
        <ul class="list-disc list-inside space-y-1 mb-4">
          <li>表名和表注释</li>
          <li>字段名、类型、注释</li>
          <li>主键信息</li>
          <li>自动转换为 Java 驼峰命名</li>
        </ul>
        <p class="mb-2">生成的代码包含：</p>
        <ul class="list-disc list-inside space-y-1 mb-4">
          <li><strong>实体类</strong> - 使用 Lombok @Data 注解</li>
          <li><strong>Mapper 接口</strong> - 包含常用 CRUD 方法</li>
          <li><strong>XML 配置</strong> - 完整的 SQL 映射</li>
        </ul>
        <p class="mb-2">Mapper 接口方法列表：</p>
        <ul class="list-disc list-inside space-y-1">
          <li><code>insertSelective</code> - 选择性插入</li>
          <li><code>insertBatchSelective</code> - 批量选择性插入</li>
          <li><code>deleteByPrimaryKey</code> - 根据主键删除</li>
          <li><code>updateByPrimaryKeySelective</code> - 根据主键选择性更新</li>
          <li><code>updateBatchByPrimaryKeySelective</code> - 批量根据主键选择性更新</li>
          <li><code>selectByPrimaryKey</code> - 根据主键查询</li>
          <li><code>selectCountByMap</code> - 根据条件查询数量</li>
          <li><code>selectByMap</code> - 根据条件查询单条</li>
          <li><code>selectListByMap</code> - 根据条件查询列表</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
:deep(.el-textarea__inner) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
}
</style>
