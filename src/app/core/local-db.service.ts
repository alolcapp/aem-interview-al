import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb-browser';

export interface LocalUser {
  _id: string;
  _rev?: string;
  passwordHash: string;
  token: string;
}

const DASHBOARD_ID = 'dashboard';

@Injectable({ providedIn: 'root' })
export class LocalDbService {

  private db = new PouchDB<any>('aem-dashboard');

  async saveUser(username: string, password: string, token: string): Promise<void> {
    const id = this.userId(username);
    const existing = await this.get<LocalUser>(id);
    await this.db.put({
      ...existing,
      _id: id,
      passwordHash: await sha256(id + password),
      token
    });
  }

  async findUser(username: string, password: string): Promise<LocalUser | null> {
    const id = this.userId(username);
    const user = await this.get<LocalUser>(id);
    if (!user || user.passwordHash !== await sha256(id + password)) {
      return null;
    }
    return user;
  }

  async saveDashboard<T>(data: T): Promise<void> {
    const existing = await this.get<{ _rev: string }>(DASHBOARD_ID);
    await this.db.put({ _id: DASHBOARD_ID, _rev: existing?._rev, data });
  }

  async getDashboard<T>(): Promise<T | null> {
    const doc = await this.get<{ data: T }>(DASHBOARD_ID);
    return doc ? doc.data : null;
  }

  private userId(username: string): string {
    return 'user:' + username.trim().toLowerCase();
  }

  private async get<T>(id: string): Promise<T | null> {
    try {
      return await this.db.get(id) as T;
    } catch {
      return null;
    }
  }
}

async function sha256(text: string): Promise<string> {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buffer), b => b.toString(16).padStart(2, '0')).join('');
}
