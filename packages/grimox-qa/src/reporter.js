import pc from 'picocolors';

const ICON = {
    pass: pc.green('✓'),
    fail: pc.red('✗'),
    skip: pc.yellow('◯'),
    info: pc.blue('ℹ'),
    qa: '🌐',
};

export function header(config, mode) {
    console.log('');
    console.log(pc.bold(pc.magenta(`${ICON.qa} grimox-qa`)) + pc.dim(` · ${config.baseUrl} · ${mode.reason}`));
    console.log(pc.dim('─'.repeat(64)));
}

export function routeResult(route, status, detail) {
    const icon = status === 'pass' ? ICON.pass : status === 'fail' ? ICON.fail : ICON.skip;
    const name = route.padEnd(32);
    const extra = detail ? pc.dim(` · ${detail}`) : '';
    console.log(`  ${icon} ${name}${extra}`);
}

export function flowResult(flow, status, issues = []) {
    const icon = status === 'pass' ? ICON.pass : ICON.fail;
    console.log('');
    console.log(`  ${icon} Flow: ${pc.bold(flow.name)}`);
    for (const issue of issues) {
        console.log(pc.dim(`      at step: ${issue.step}`));
        if (issue.expected) console.log(pc.dim(`      expected: ${issue.expected}`));
        if (issue.actual) console.log(pc.dim(`      actual:   ${issue.actual}`));
        if (issue.consoleError) console.log(pc.red(`      console: ${issue.consoleError}`));
        if (issue.network) console.log(pc.red(`      network: ${issue.network}`));
        if (issue.hypothesis) console.log(pc.yellow(`      💡 ${issue.hypothesis}`));
        if (issue.screenshot) console.log(pc.dim(`      📸 ${issue.screenshot}`));
    }
}

export function summary({ passed, failed, total, escalated }) {
    console.log('');
    console.log(pc.dim('─'.repeat(64)));

    if (escalated.length > 0) {
        console.log(pc.red(pc.bold(`\n⚠  ESCALATION — ${escalated.length} flow(s) failed 3 times in a row:`)));
        for (const name of escalated) {
            console.log(pc.red(`   · ${name}`));
        }
        console.log(pc.dim(`\n   Manual intervention required. Reset with: grimox-qa --reset`));
        console.log(pc.dim(`   Exit code: 2`));
        return;
    }

    if (failed === 0) {
        console.log(pc.green(pc.bold(`✓ QA passed — ${passed}/${total} flows`)));
    } else {
        console.log(pc.red(pc.bold(`✗ QA failed — ${failed}/${total} flows`)));
        console.log(pc.dim(`  See evidence in .grimox/qa-evidence/`));
        console.log(pc.dim(`  Exit code: 1`));
    }
}

export function info(msg) {
    console.log(pc.dim(`  ${ICON.info} ${msg}`));
}

export function warn(msg) {
    console.log(pc.yellow(`  ⚠ ${msg}`));
}
