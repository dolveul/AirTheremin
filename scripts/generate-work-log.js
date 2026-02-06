#!/usr/bin/env node

/**
 * 작업 일지 자동 생성 스크립트
 * 
 * 사용법:
 *   npm run work-log              # 오늘 날짜의 작업 일지 생성/업데이트
 *   npm run work-log -- 2025-01-15 # 특정 날짜의 작업 일지 생성/업데이트
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const workLogsDir = join(projectRoot, 'docs', 'work-logs');

// 날짜 포맷팅 함수
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 요일 한글 변환
function getDayOfWeek(date) {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[date.getDay()];
}

// Git 커밋 로그 가져오기
function getGitCommits(date) {
  try {
    const dateStr = formatDate(date);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    const nextDateStr = formatDate(nextDate);
    
    // 해당 날짜의 커밋 로그 가져오기 (날짜만 사용, 시간 미포함)
    const gitLog = execSync(
      `git log --since="${dateStr} 00:00:00" --until="${nextDateStr} 00:00:00" --pretty=format:"%h|%s|%an"`,
      { cwd: projectRoot, encoding: 'utf-8' }
    ).trim();
    
    if (!gitLog) return [];
    
    return gitLog.split('\n').map(line => {
      const [hash, message, author] = line.split('|');
      return { hash, message, author };
    });
  } catch (error) {
    // Git 저장소가 아니거나 커밋이 없는 경우
    return [];
  }
}

// 변경된 파일 목록 가져오기
function getChangedFiles(date) {
  try {
    const dateStr = formatDate(date);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    const nextDateStr = formatDate(nextDate);
    
    const changedFiles = execSync(
      `git log --since="${dateStr} 00:00:00" --until="${nextDateStr} 00:00:00" --name-only --pretty=format:""`,
      { cwd: projectRoot, encoding: 'utf-8' }
    ).trim();
    
    if (!changedFiles) return [];
    
    const files = changedFiles.split('\n').filter(line => line.trim() && !line.startsWith('commit'));
    return [...new Set(files)]; // 중복 제거
  } catch (error) {
    return [];
  }
}

// 작업 일지 템플릿 생성
function generateWorkLogTemplate(date, existingContent = '') {
  const dateStr = formatDate(date);
  const dayOfWeek = getDayOfWeek(date);
  const commits = getGitCommits(date);
  const changedFiles = getChangedFiles(date);
  
  // 기존 내용이 있으면 파싱
  let existingSections = {};
  if (existingContent) {
    const sections = existingContent.split(/^## /m);
    sections.forEach(section => {
      if (section.trim()) {
        const lines = section.split('\n');
        const title = lines[0].trim();
        existingSections[title] = section.substring(title.length).trim();
      }
    });
  }
  
  let content = `# 작업 일지 - ${dateStr} (${dayOfWeek})\n\n`;
  content += `**작성일**: ${dateStr}\n`;
  content += `**요일**: ${dayOfWeek}요일\n\n`;
  content += `---\n\n`;
  
  // 작업 개요
  content += `## 📋 작업 개요\n\n`;
  if (existingSections['📋 작업 개요']) {
    content += existingSections['📋 작업 개요'] + '\n\n';
  } else {
    content += `- [ ] 작업 내용을 작성하세요\n\n`;
  }
  
  // 완료된 작업
  content += `## ✅ 완료된 작업\n\n`;
  if (commits.length > 0) {
    commits.forEach(commit => {
      content += `### ${commit.message}\n`;
      content += `- **커밋**: \`${commit.hash}\`\n`;
      content += `- **작성자**: ${commit.author}\n\n`;
    });
  } else {
    if (existingSections['✅ 완료된 작업']) {
      content += existingSections['✅ 완료된 작업'] + '\n\n';
    } else {
      content += `- 오늘 완료한 작업을 작성하세요\n\n`;
    }
  }
  
  // 변경된 파일
  if (changedFiles.length > 0) {
    content += `## 📝 변경된 파일\n\n`;
    changedFiles.forEach(file => {
      content += `- \`${file}\`\n`;
    });
    content += `\n`;
  }
  
  // 진행 중인 작업
  content += `## 🚧 진행 중인 작업\n\n`;
  if (existingSections['🚧 진행 중인 작업']) {
    content += existingSections['🚧 진행 중인 작업'] + '\n\n';
  } else {
    content += `- 진행 중인 작업이 있다면 작성하세요\n\n`;
  }
  
  // 다음 작업 계획
  content += `## 📅 다음 작업 계획\n\n`;
  if (existingSections['📅 다음 작업 계획']) {
    content += existingSections['📅 다음 작업 계획'] + '\n\n';
  } else {
    content += `- 내일 또는 다음에 할 작업을 작성하세요\n\n`;
  }
  
  // 이슈 및 메모
  content += `## 💡 이슈 및 메모\n\n`;
  if (existingSections['💡 이슈 및 메모']) {
    content += existingSections['💡 이슈 및 메모'] + '\n\n';
  } else {
    content += `- 발생한 이슈나 특이사항을 작성하세요\n\n`;
  }
  
  // 작업일 (날짜 단위만, 시간 미기록)
  content += `## 📆 작업일\n\n`;
  if (existingSections['📆 작업일']) {
    content += existingSections['📆 작업일'] + '\n\n';
  } else if (existingSections['⏰ 작업 시간']) {
    content += existingSections['⏰ 작업 시간'] + '\n\n';
  } else {
    content += `- **작업일**: ${dateStr}\n\n`;
  }
  
  content += `---\n\n`;
  content += `*이 문서는 자동으로 생성되었습니다. 필요시 수동으로 수정하세요.*\n`;
  
  return content;
}

// 메인 함수
function main() {
  // 날짜 파싱 (인자로 받거나 오늘 날짜 사용)
  let targetDate = new Date();
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    const dateArg = args[0];
    if (dateArg.match(/^\d{4}-\d{2}-\d{2}$/)) {
      targetDate = new Date(dateArg);
      if (isNaN(targetDate.getTime())) {
        console.error('❌ 잘못된 날짜 형식입니다. YYYY-MM-DD 형식을 사용하세요.');
        process.exit(1);
      }
    } else {
      console.error('❌ 잘못된 날짜 형식입니다. YYYY-MM-DD 형식을 사용하세요.');
      process.exit(1);
    }
  }
  
  // 작업 일지 디렉토리 생성
  if (!existsSync(workLogsDir)) {
    mkdirSync(workLogsDir, { recursive: true });
    console.log(`✅ 작업 일지 디렉토리 생성: ${workLogsDir}`);
  }
  
  // 작업 일지 파일 경로
  const dateStr = formatDate(targetDate);
  const logFilePath = join(workLogsDir, `${dateStr}.md`);
  
  // 기존 파일이 있으면 읽기
  let existingContent = '';
  if (existsSync(logFilePath)) {
    existingContent = readFileSync(logFilePath, 'utf-8');
    console.log(`📝 기존 작업 일지 파일 발견: ${logFilePath}`);
  }
  
  // 작업 일지 생성
  const workLogContent = generateWorkLogTemplate(targetDate, existingContent);
  
  // 파일 저장
  writeFileSync(logFilePath, workLogContent, 'utf-8');
  
  console.log(`✅ 작업 일지 생성 완료: ${logFilePath}`);
  console.log(`📊 커밋 수: ${getGitCommits(targetDate).length}`);
  console.log(`📁 변경된 파일 수: ${getChangedFiles(targetDate).length}`);
}

main();

