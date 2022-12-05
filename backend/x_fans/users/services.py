from botocore.exceptions import ClientError
from django.conf import settings

from common.s3_client import S3BotoClient
from common.web_provider import OlympusWeb3Provider
from eth_account.messages import encode_defunct
from hexbytes import HexBytes

from cryptography.fernet import Fernet

import logging

logger = logging.getLogger(__name__)

def get_provider():
    return OlympusWeb3Provider.w3


def verify_signature(public_address: str, text_msg: str, signature: str) -> bool:
    w3 = get_provider()

    mesage = encode_defunct(text=text_msg)
    address = w3.eth.account.recover_message(
        mesage, signature=HexBytes(signature))
    return address == public_address


def upload_file(file, bucket_name, object_name):
    S3BotoClient.s3.upload_fileobj(file, bucket_name, object_name)


def generate_presigned_bucket_url(bucket_name, object_name, expires_in=3600) -> str:
    return S3BotoClient.s3.generate_presigned_url(
        'get_object',
        Params={
            'Bucket': bucket_name,
            'Key': object_name,
        },
        ExpiresIn=expires_in,
    )


def get_deployer_contract():
    deployer_contract_address = settings.DEPLOYER_CONTRACT_CONFIG["contract_address"]
    w3 = get_provider()
    abi = settings.DEPLOY_CREATOR_NFT_ABI
    contract = w3.eth.contract(address=deployer_contract_address, abi=abi)
    return contract

def get_creator_contract(contract_address):
    w3 = get_provider()
    abi = settings.CREATOR_NFT_ABI
    contract = w3.eth.contract(address=contract_address, abi=abi)
    return contract



def get_contract_address_from_symbol(symbol) -> str:
    contract_address = get_deployer_contract().functions.getContractAddressFromSymbol(symbol).call()
    return contract_address


def deploy_contract_for_creator(
        creator_address,
        price,
        user_reference_id,
        creator_name,
        creator_symbol,
        creator_token_uri,
) -> str:
    w3 = get_provider()
    public_key = settings.DEPLOYER_CONTRACT_CONFIG["public_key"]
    private_key = settings.DEPLOYER_CONTRACT_CONFIG["private_key"]
    contract = get_deployer_contract()

    nonce = w3.eth.get_transaction_count(
        public_key
    )
    transaction = contract.functions.deployNFT(
        creator_address,
        price,
        str(user_reference_id),
        creator_name,
        creator_symbol,
        creator_token_uri,
    ).buildTransaction({
        'gas': 8000000,
        'gasPrice': w3.toWei('1', 'gwei'),
        'from': public_key,
        'nonce': nonce,
    })
    signed_txn = w3.eth.account.signTransaction(transaction, private_key=private_key)
    tx = w3.eth.sendRawTransaction(signed_txn.rawTransaction)
    return tx.hex()


def user_owns_nft(user_ethereum_address, contract_address):
    if contract_address:
        contract = get_creator_contract(contract_address)
        return contract.functions.balanceOf(user_ethereum_address).call() > 0
    else:
        return False

