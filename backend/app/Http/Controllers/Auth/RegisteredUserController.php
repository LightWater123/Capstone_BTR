<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AdminUser;
use App\Models\ServiceUser;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $baseRules = [
            'name'          => 'required|string|max:255',
            'username'      => 'required|string|max:255|unique:users,username',
            'email'         => 'required|email|unique:users,email',
            'password'      => 'required|string|min:6',
            'mobile_number' => 'required|string|max:20',
            'role'          => 'required|in:admin,service_user,oic',
        ];

        $serviceUserRules = [
            'address'       => 'required|string|max:500',
            'service_type'  => 'required|in:Vehicle,Appliances,ICT Equipment',
        ];

        $rules = $request->role === 'service_user'
            ? array_merge($baseRules, $serviceUserRules)
            : $baseRules;

        $validated = $request->validate($rules);

        // Format mobile number
        $digitsOnly = preg_replace('/\D+/', '', $validated['mobile_number']);
        if (strlen($digitsOnly) === 11) {
            $validated['mobile_number'] = substr($digitsOnly, 0, 4) . '-' .
                                          substr($digitsOnly, 4, 3) . '-' .
                                          substr($digitsOnly, 7);
        } else {
            return response()->json(['error' => 'Mobile number must contain exactly 11 digits.'], 422);
        }

        // Route to appropriate collection based on role
        if ($validated['role'] === 'admin') {
            $user = AdminUser::create([
                'name'          => $validated['name'],
                'username'      => $validated['username'],
                'email'         => $validated['email'],
                'password'      => Hash::make($validated['password']),
                'mobile_number' => $validated['mobile_number'],
                'role'          => $validated['role'],
            ]);
        } elseif ($validated['role'] === 'service_user') {
            $user = ServiceUser::create([
                'name'          => $validated['name'],
                'username'      => $validated['username'],
                'email'         => $validated['email'],
                'password'      => Hash::make($validated['password']),
                'mobile_number' => $validated['mobile_number'],
                'role'          => $validated['role'],
                'address'       => $validated['address'],
                'service_type'  => $validated['service_type'],
            ]);
        } else {
            $user = User::create([
                'name'          => $validated['name'],
                'username'      => $validated['username'],
                'email'         => $validated['email'],
                'password'      => Hash::make($validated['password']),
                'mobile_number' => $validated['mobile_number'],
                'role'          => $validated['role'],
            ]);
        }

        event(new Registered($user));
        Auth::login($user);

        return response()->json([
            'message' => 'Registration successful',
            'user'    => $user,
        ]);
    }
}
