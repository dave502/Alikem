import { 
    Alert, 
    AlertIcon, 
    AlertTitle, 
    AlertDescription, 
    Box, 
    CloseButton,
    useDisclosure } from '@chakra-ui/react'

const AlertBox = ((props) =>{
    
    const {
        isOpen: visible,
        onClose,
        onOpen,
      } = useDisclosure({ defaultIsOpen: true })
    

    const {title, descritption, level, setAlertText } = props;
    
    const ClearAlert = () => {
        onClose()
        setAlertText("")
    }

    return (
    <Alert status={level || 'error'}  position="sticky" top='0' ref={props.reference} zIndex={999}>
        <AlertIcon />
        <Box width='100%'>
            <AlertTitle >{title}</AlertTitle>
            <AlertDescription fontSize='md'>
                {descritption}
            </AlertDescription>
        </Box>
        <CloseButton
            alignSelf='flex-start'
            position='relative'
            right={-1}
            top={-1}
            onClick={ClearAlert}
        />
    </Alert>
    );
  })

  export default AlertBox;
