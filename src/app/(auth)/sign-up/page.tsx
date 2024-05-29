'use client'

import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import axios, {AxiosError} from "axios"
import {useDebounceValue} from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signupSchema'


const Page = () => {

  const [userName, setUserName] = useState('')
  const [userNameMessage,setUserNameMessage] = useState('')
  const [isCheckingUserName,setIsCheckingUserName] = useState(false)
  const [isSubmitting,setIsSubmitting] = useState(false)

  const debouncedUsername = useDebounceValue(userName,300)
  const { toast } = useToast()
  const router = useRouter()

  // zodd implimantaion in form
  const form = useForm<z.infer<typeof signUpSchema>>({ //<z.infer<typeof signUpSchema>> this is optional 
    resolver: zodResolver(signUpSchema),
    defaultValues : {
      username : '',
      email : '',
      password : '',
    }
  })

  useEffect(() => {
    const checkUserNameUnique = async () => {
      if(debouncedUsername) {
        setIsCheckingUserName(true)
        setUserNameMessage('')

        try {
          const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
          setUserNameMessage(response.data.message)

        } catch(error) {

        }
      }
    }
  },[debouncedUsername])


  return (
    <>

    </> 
  )
}

export default Page
