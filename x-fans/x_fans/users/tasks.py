import logging

from celery import shared_task

from users import services
from users.models import UserNFT

logger = logging.getLogger(__name__)

@shared_task
def refresh_contract_address(user_nft_id):
    user_nft: UserNFT = UserNFT.objects.get(id=user_nft_id)
    contract_address = services.get_contract_address_from_symbol(user_nft.ticker)
    user_nft.contract_address = contract_address
    user_nft.nft_creation_status = UserNFT.STATUS_SUCCESS
    user_nft.save()


@shared_task
def refresh_nft_status(user_nft_id):
    user_nft: UserNFT = UserNFT.objects.get(id=user_nft_id)
    w3 = services.get_provider()
    user = user_nft.user
    transaction_receipt: dict = w3.eth.get_transaction_receipt(user_nft.transaction_hash)

    # has not been confirmed
    if not transaction_receipt:
        return

    # deploy contract again
    if transaction_receipt and transaction_receipt.get("status") == 0:
        tx = services.deploy_contract_for_creator(
            user.ethereum_address,
            user_nft.price,
            str(user.id),
            user.name,
            user_nft.ticker,
            ""
        )
        logger.info(f"deploying again for failed contract creation. New hash = {tx}")
        user_nft.transaction_hash = tx
        user_nft.save()

    # has been confirmed and no errors
    else:
        refresh_contract_address(user_nft.id)
