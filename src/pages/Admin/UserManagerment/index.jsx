import { useQuery } from '@tanstack/react-query'
import { message } from 'antd'
import dayjs from 'dayjs'
import React, { useEffect, useReducer, useState } from 'react'
import useMutationHooks from '~/hooks/useMutationHooks'
import * as UserManagermentService from '~/services/user.managerment.service'
const active_type = {
  CHANGE_ACTIVE:"CHANGE_ACTIVE",
  SET_USER_LIST:"SET_USER_LIST"
}
const userManageReducer = (state,action)=>{
  switch(action.type){
    case active_type.SET_USER_LIST:{
      if(action.payload.users)
      return action.payload.users
      return state
    }
    case active_type.CHANGE_ACTIVE:{
      const users = [...state]
      if(action.payload.id){
        users.forEach((user)=>{
          if(user._id == action.payload.id){
            user.active = !user.active
          }
        })
        return users
      }
      return state
    }
    default : return state
  }
}
const UserManagerment = () => {
  const [userList,dispatchUserList] = useReducer(userManageReducer,[])
  const userListQuery = useQuery({queryKey:['userListQuery'],queryFn:()=>UserManagermentService.getUserList({})})
  useEffect(()=>{
    if(userListQuery.data){
      dispatchUserList({
        type:active_type.SET_USER_LIST,
        payload:{ 
          users:userListQuery.data?.users
        }
      })
    }
    else if (userListQuery.isError){
      message.error("đã có lỗi xảy ra")
    }
  },[userListQuery])
  const changeActiveUserMutation = useMutationHooks((data)=>UserManagermentService.changeActiveUser(data))
  const handleChangeActiveUser = (id)=>{
    if(!id) return
    changeActiveUserMutation.mutate({id})
    dispatchUserList({
      type:active_type.CHANGE_ACTIVE,
      payload: {
        id
      }
    })
  }
  return (
  <>
    <div className="p-6 overflow-x-scroll px-0 pt-0 pb-2">
        <table className="w-full min-w-[640px] table-auto">
          <thead>
              <tr>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <p className="block antialiased font-sans text-[11px] font-bold uppercase text-blue-gray-400">Người dùng</p>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <p className="block antialiased font-sans text-[11px] font-bold uppercase text-blue-gray-400">SĐT</p>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <p className="block antialiased font-sans text-[11px] font-bold uppercase text-blue-gray-400">Thời điểm đăng ký</p>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <p className="block antialiased font-sans text-[11px] font-bold uppercase text-blue-gray-400">Hoạt động</p>
                </th>
              </tr>
          </thead>
          <tbody>
          {userList?.map((user,idx)=>(
            <tr key={idx}>
                <td className="py-3 px-5 border-b border-blue-gray-50">
                    <div className="flex items-center gap-4">
                      <img src={user.avatar} alt="Avatar" className="inline-block relative object-cover object-center w-9 h-9 rounded-md"/>
                      <div>
                          <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-semibold">{user.name|| ""}</p>
                          <p className="block antialiased font-sans text-xs font-normal text-blue-gray-500">{user.email|| ""}</p>
                      </div>
                    </div>
                </td>
                <td className="py-3 px-5 border-b border-blue-gray-50">
                <p className="block antialiased font-sans text-xs font-semibold text-blue-gray-600">{user.phone || ""}</p>
                </td>
                <td className="py-3 px-5 border-b border-blue-gray-50">
                    <p className="block antialiased font-sans text-xs font-semibold text-blue-gray-600">{user.createdAt? dayjs(user.createdAt).format("DD/MM/YYYY") :"null" }</p>
                </td>
                <td className="py-3 px-5 border-b border-blue-gray-50">
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" onChange={()=>handleChangeActiveUser(user._id)} checked={user.active} />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-primary dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary dark:peer-checked:bg-primary"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                  </label>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
    </div>
  </>
  )
}

export default UserManagerment