'use client'

import React, { useState, useEffect, useRef } from 'react'
import useSWR from 'swr';
import { useDebounce } from './useDebounce';
import { Search } from 'lucide-react';

const optionFetcher =  (url: string) => fetch(url).then(res => res.json())

interface IProps {
    api: string
    label: string
    paramsName: string
    handleGetValue: (value: { _id: string, name: string }) => void
}

type TOption = { value: string, label: string }

export const SelectWithSearch = ({api, label, paramsName,handleGetValue}:IProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<TOption | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const debouncedSearch = useDebounce(searchTerm, 300);

    const apiWithParams = `${api}?${paramsName}=${debouncedSearch}`

    const { data: _options, isLoading: _isLoading } = useSWR<{ data: {_id: string, name: string}[] }>(
        apiWithParams,
        optionFetcher,
        { revalidateOnFocus: false, dedupingInterval: 30000 }
    );

    const options = _options?.data?.map((item) => ({
        value: item._id,
        label: item?.name
    })) || [] as TOption[];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOptionSelect = (option: TOption) => {
        setSelectedOption(option);
        setIsOpen(false);
        setSearchTerm(option.label);
        handleGetValue({ _id: option.value, name: option.label })
    };

    return (
        <div className="mb-4 flex flex-col gap-2" ref={dropdownRef}>
            <label className="input-label relative flex items-center gap-3">
                {label}
            </label>

            <div className="relative">
                <div className="relative">
                    <input
                        type="text"
                        className="input-form w-full pr-10 border pl-3 py-1"
                        placeholder="Search options..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsOpen(true);
                        }}
                        onClick={() => setIsOpen(true)}
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>{isOpen && (
                        <div
                                                                                                                className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto origin-top animate-scale-in"
                        >
                            {_isLoading ? (
                                <div className="p-4 text-center text-gray-500">Loading...</div>
                            ) : options.length > 0 ? (
                                options.map((option) => (
                                    <div
                                        key={option.value}
                                                                                className="p-3 cursor-pointer border-b last:border-b-0 hover:bg-gray-50 flex items-center justify-between gap-4 transition-all duration-150 hover:scale-[1.01]"
                                        onClick={() => handleOptionSelect(option)}
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-800 mb-1">{option.label}</div>
                                        </div>

                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500">No options found</div>
                            )}
                        </div>
                    )}</div>
        </div>
    )
}
