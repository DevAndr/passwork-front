import {type FC, useEffect, useState} from "react";
import {Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTrigger} from "@/components/ui/popover.tsx";
import {clsx} from "clsx";


interface Props {
    isVisible: boolean
    decryptedPassword: string
}

export const PasswordVisibilityToggle: FC<Props> = ({isVisible, decryptedPassword}) => {
    const [isOpenTooltipCopy, setIsOpenTooltipCopy] = useState(false)

    useEffect(() => {
        let id = null;

        if (isOpenTooltipCopy) {
            id = setTimeout(() => setIsOpenTooltipCopy(false), 1500)
        }

        return () => {
            if (id) {
                clearTimeout(id);
            }
        }
    }, [isOpenTooltipCopy, setIsOpenTooltipCopy]);

    const copyPassword = async () => {
        if (isVisible && window.navigator) {
            try {
                await navigator.clipboard.writeText(decryptedPassword);
                setIsOpenTooltipCopy(true);
            } catch (err) {
                console.error('Ошибка при копировании: ', err);
            }
        }
    }

    return <Popover open={isOpenTooltipCopy}>
        <PopoverTrigger>
                        <span className={clsx('font-mono', {
                            'cursor-pointer': isVisible
                        })} onClick={copyPassword}>
                                        {isVisible
                                            ? decryptedPassword
                                            : "••••••••"}
                                    </span>
        </PopoverTrigger>
        {
            isVisible && <PopoverContent align="start" className='w-[100]'>
                <PopoverHeader>
                    <PopoverDescription>Скопировано!</PopoverDescription>
                </PopoverHeader>
            </PopoverContent>
        }
    </Popover>
}