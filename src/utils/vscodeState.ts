// src/utils/vscodeState.ts
import * as vscode from 'vscode';

export const VS_CODE_STATE_KEY = 'sessionInfo';

export function getSessionInfo(context: vscode.ExtensionContext) {
  return context.globalState.get(VS_CODE_STATE_KEY);
}

export async function setSessionInfo(
  context: vscode.ExtensionContext,
  sessionInfo: any
) {
  await context.globalState.update(VS_CODE_STATE_KEY, sessionInfo);
}

export async function clearSessionInfo(context: vscode.ExtensionContext) {
  await context.globalState.update(VS_CODE_STATE_KEY, undefined);
}

export function getAllStateKeys(context: vscode.ExtensionContext) {
  return context.globalState.keys();
}
