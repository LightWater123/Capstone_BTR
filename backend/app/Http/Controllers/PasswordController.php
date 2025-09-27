<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class PasswordController extends Controller
{
    public function change(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password'       => 'required|min:8|confirmed',
        ]);

        $user = Auth::user();          // works for both guards
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 400);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password updated successfully']);
    }
}