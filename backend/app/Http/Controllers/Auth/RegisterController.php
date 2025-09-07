<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'mobile_number' => 'required|string|max:20',
            'role' => 'required|in:admin,service_user,oic',
        ]);

        $digitsOnly = preg_replace('/\D+/', '', $validated['mobile_number']);
        if (strlen($digitsOnly) === 11) {
            $validated['mobile_number'] = substr($digitsOnly, 0, 4) . '-' .
                                          substr($digitsOnly, 4, 3) . '-' .
                                          substr($digitsOnly, 7);
        } else {
            return response()->json(['error' => 'Mobile number must contain exactly 11 digits.'], 422);
        }

        $user = User::create([
            ...$validated,
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json(['user' => $user], 201);
    }
}

