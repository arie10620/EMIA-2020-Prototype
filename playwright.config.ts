import {defineConfig} from '@playwright/test';

export default defineConfig({
 testDir:'./tests',
 timeout:150_000,
 expect:{timeout:5_000},
 fullyParallel:true,
 workers:2,
 reporter:'list',
 use:{actionTimeout:15_000,navigationTimeout:20_000,baseURL:'http://127.0.0.1:5174/EMIA-2020-Prototype/',viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce',trace:'retain-on-failure'},
 projects:[{name:'chromium',use:{browserName:'chromium',channel:'chrome'}},{name:'webkit',use:{browserName:'webkit'}}],
 webServer:{command:'npm run dev -- --port 5174 --strictPort',url:'http://127.0.0.1:5174/EMIA-2020-Prototype/',reuseExistingServer:!process.env.CI},
});
