import { NextResponse } from 'next/server';
import { setSessionCookie } from '../../../../lib/auth/session';
import { UserSession } from '../../../../lib/types';
import { dataService } from '../../../../lib/db/dataService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check Demo Accounts
    let userSession: UserSession | null = null;

    if (cleanEmail === 'admin@example.com' && password === 'Admin@123') {
      userSession = {
        id: 'user_admin',
        name: 'System Administrator',
        email: 'admin@example.com',
        role: 'ADMIN',
      };
    } else if (cleanEmail === 'student@example.com' && password === 'Student@123') {
      userSession = {
        id: 'user_stud_1',
        name: 'Aarav Sharma',
        email: 'student@example.com',
        role: 'STUDENT',
        studentId: 'stud_1',
      };
    } else if (cleanEmail === 'company@example.com' && password === 'Company@123') {
      userSession = {
        id: 'user_company',
        name: 'Google Recruiter',
        email: 'company@example.com',
        role: 'COMPANY',
        companyId: 'comp_google',
      };
    } else {
      // Check if it's one of the other seeded students
      const students = await dataService.getStudents();
      const matchedStudent = students.find((s) => s.email.toLowerCase() === cleanEmail);
      if (matchedStudent && (password === 'Student@123' || password === 'password')) {
        userSession = {
          id: matchedStudent.userId,
          name: matchedStudent.name,
          email: matchedStudent.email,
          role: 'STUDENT',
          studentId: matchedStudent.id,
        };
      }
    }

    if (!userSession) {
      return NextResponse.json(
        {
          error:
            'Invalid credentials. Please use demo credentials: admin@example.com (Admin@123), student@example.com (Student@123), or company@example.com (Company@123).',
        },
        { status: 401 }
      );
    }

    // Set secure HTTP-only session cookie
    await setSessionCookie(userSession);

    return NextResponse.json({
      success: true,
      user: userSession,
      redirectUrl:
        userSession.role === 'ADMIN'
          ? '/admin/dashboard'
          : userSession.role === 'STUDENT'
          ? '/student/dashboard'
          : '/company/dashboard',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
