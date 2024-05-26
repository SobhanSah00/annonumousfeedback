'use client'

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import axios from "axios"
import {useDebounceValue} from 'usehooks-ts'

const Page = () => {

  const [userName, setUserName] = useState('')
  const [userNameMessage,setUserNameMessage] = useState('')
  const [isCheckingUserName,setIsCheckingUserName] = useState(false)
  const [isSubmitting,setIsSubmitting] = useState(false)

  const debouncedValue = useDebounceValue(userName,300)


  return (
    <div>page</div>
  )
}

export default Page
