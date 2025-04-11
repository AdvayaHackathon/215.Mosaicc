"use client"
import { SignUp } from "@clerk/nextjs"

import React from 'react'

const SignUpPage = () => {
  return (
    <div>
        <SignUp fallbackRedirectUrl="/test"/>
    </div>
  )
}

export default SignUpPage